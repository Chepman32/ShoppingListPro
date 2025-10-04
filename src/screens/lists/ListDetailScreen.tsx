/**
 * List Detail Screen
 * Shows items in a list with swipe-to-delete and drag-to-reorder
 * Based on SDD Section 6.4
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Input, Checkbox } from '../../components/core';
import { database, List, ListItem } from '../../database';
import { colors, typography, spacing } from '../../theme';
import { Q } from '@nozbe/watermelondb';
import { useListsStore, useSuggestionsStore } from '../../stores';
import type { View as RNView } from 'react-native';

export const ListDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { listId } = route.params as { listId: string };

  const [list, setList] = useState<List | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);

  const { getSuggestions, addRecentItem } = useSuggestionsStore();
  const deleteList = useListsStore((state) => state.deleteList);
  const suggestions = getSuggestions(newItemName, 8);
  const insets = useSafeAreaInsets();
  const menuTriggerRef = useRef<RNView | null>(null);

  useEffect(() => {
    loadListAndItems();
  }, [listId]);

  const loadListAndItems = async () => {
    const loadedList = await database.get<List>('lists').find(listId);
    setList(loadedList);

    const listItems = await loadedList.items
      .extend(Q.sortBy('position', Q.asc))
      .fetch();
    setItems(listItems);
  };

  const handleAddItem = async (itemName?: string) => {
    const nameToAdd = itemName || newItemName.trim();
    if (!nameToAdd || !list) return;

    await database.write(async () => {
      const itemsCollection = database.get<ListItem>('list_items');
      await itemsCollection.create((item) => {
        item.listId = list.id;
        item.name = nameToAdd;
        item.quantity = 1;
        item.unit = 'unit';
        item.category = 'other';
        item.isChecked = false;
        item.position = items.length;
      });
    });

    // Track this item in recent items
    addRecentItem(nameToAdd);

    setNewItemName('');
    setShowSuggestions(false);
    loadListAndItems();
  };

  const handleSuggestionPress = (suggestion: string) => {
    handleAddItem(suggestion);
  };

  const handleToggleItem = async (item: ListItem) => {
    await item.toggle();
    loadListAndItems();
  };

  const handleDeleteItem = async (item: ListItem) => {
    await database.write(async () => {
      await item.markAsDeleted();
    });
    loadListAndItems();
  };

  const handleOpenProduct = (item: ListItem) => {
    navigation.navigate(
      'Product' as never,
      {
        product: {
          name: item.name,
          quantity: String(item.quantity ?? 1),
          unit: item.unit || 'pcs',
          category: item.category,
          notes: item.notes,
          description: item.notes,
          imageUri: item.imageUri,
          attachments: [],
          lastUpdated: new Date().toISOString(),
        },
      } as never
    );
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
    setMenuPosition(null);
  };

  const handleShareList = async () => {
    if (!list) return;

    const unchecked = items.filter((item) => !item.isChecked);
    const completed = items.filter((item) => item.isChecked);

    const messageLines: string[] = [list.name];

    if (unchecked.length > 0) {
      messageLines.push('', 'To Buy:');
      unchecked.forEach((item) => {
        const quantityLabel = item.quantity ? ` (${item.quantity} ${item.unit})` : '';
        messageLines.push(`- ${item.name}${quantityLabel}`);
      });
    }

    if (completed.length > 0) {
      messageLines.push('', 'Completed:');
      completed.forEach((item) => {
        messageLines.push(`- ${item.name}`);
      });
    }

    if (messageLines.length === 1) {
      messageLines.push('', 'No items yet');
    }

    try {
      await Share.share({
        message: messageLines.join('\n'),
        title: list.name,
      });
    } catch (error) {
      console.error('Error sharing list:', error);
    } finally {
      closeMenu();
    }
  };

  const handleSearchPress = () => {
    closeMenu();
    setIsSearching(true);
    setShowSuggestions(false);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
  };

  const handleDeleteListPress = () => {
    if (!list) return;

    closeMenu();

    Alert.alert('Delete List', `Are you sure you want to delete "${list.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteList(list.id);
          closeMenu();
          navigation.goBack();
        },
      },
    ]);
  };

  const handleMenuOpen = () => {
    setMenuPosition(null);
    const node = menuTriggerRef.current;

    if (node && typeof node.measureInWindow === 'function') {
      node.measureInWindow((x, y, width, height) => {
        const windowWidth = Dimensions.get('window').width;
        const top = y + height + spacing.xs;
        const right = Math.max(spacing.sm, windowWidth - (x + width));

        setMenuPosition({ top, right });
        setIsMenuVisible(true);
      });
    } else {
      setMenuPosition(null);
      setIsMenuVisible(true);
    }
  };

  const completedItemsCount = items.filter((i) => i.isChecked).length;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
    : items;
  const fallbackMenuTop = insets.top + spacing.xl;
  const menuPositionStyle = {
    top: menuPosition ? Math.max(fallbackMenuTop, menuPosition.top) : fallbackMenuTop,
    right: menuPosition ? Math.max(spacing.sm, menuPosition.right) : spacing.lg,
  };

  if (!list) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.listName}>{list.name}</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={() => setIsEditing((prev) => !prev)} style={styles.editButton}>
            <Text style={[styles.editButtonText, isEditing && styles.editButtonTextActive]}>
              {isEditing ? 'Done' : 'Edit'}
            </Text>
          </Pressable>
          <View ref={menuTriggerRef} collapsable={false}>
            <Pressable onPress={handleMenuOpen} style={styles.menuTrigger}>
              <Text style={styles.menuButton}>⋯</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {completedItemsCount} / {items.length} completed
        </Text>
        {items.length > 0 && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(completedItemsCount / items.length) * 100}%`,
                },
              ]}
            />
          </View>
        )}
      </View>

      {/* Add Item Input */}
      <View style={styles.addItemContainer}>
        {isSearching && (
          <View style={styles.searchContainer}>
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search items..."
              autoFocus
              returnKeyType="search"
              style={styles.searchInput}
            />
            <Pressable onPress={handleCancelSearch} style={styles.cancelSearchButton}>
              <Text style={styles.cancelSearchText}>Cancel</Text>
            </Pressable>
          </View>
        )}
        <Input
          value={newItemName}
          onChangeText={(text) => {
            setNewItemName(text);
            setShowSuggestions(text.trim().length > 0);
          }}
          placeholder="Add item..."
          onSubmitEditing={() => handleAddItem()}
          onFocus={() => {
            if (newItemName.trim().length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          returnKeyType="done"
          style={styles.addItemInput}
        />

        {/* Suggestions */}
        {showSuggestions && !isSearching && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <View style={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Items List */}
      <View style={styles.itemsContainer}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySubtext}>Add your first item above</Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsTitle}>No matching items</Text>
            <Text style={styles.noResultsSubtitle}>Try a different search term</Text>
          </View>
        ) : (
          <FlashList
            data={filteredItems}
            renderItem={({ item, index }) => (
              <ItemRow
                item={item}
                index={index}
                onToggle={() => handleToggleItem(item)}
                onDelete={() => handleDeleteItem(item)}
                isEditing={isEditing}
                onPress={!isEditing ? () => handleOpenProduct(item) : undefined}
              />
            )}
            estimatedItemSize={80}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={isMenuVisible}
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.menuOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.menuContainer, menuPositionStyle]}>
                <Pressable style={styles.menuItem} onPress={handleShareList}>
                  <Text style={styles.menuItemText}>Share</Text>
                </Pressable>
                <View style={styles.menuDivider} />
                <Pressable style={styles.menuItem} onPress={handleSearchPress}>
                  <Text style={styles.menuItemText}>Search</Text>
                </Pressable>
                <View style={styles.menuDivider} />
                <Pressable style={styles.menuItem} onPress={handleDeleteListPress}>
                  <Text style={[styles.menuItemText, styles.menuItemDanger]}>Delete</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const ItemRow: React.FC<{
  item: ListItem;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onPress?: () => void;
}> = ({ item, index, onToggle, onDelete, isEditing, onPress }) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 30)}
      layout={Layout.springify()}
      style={styles.itemRow}
    >
      <Checkbox checked={item.isChecked} onChange={onToggle} />
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [
          styles.itemContent,
          pressed && styles.itemContentPressed,
        ]}
      >
        <Text
          style={[
            styles.itemName,
            item.isChecked && styles.itemNameChecked,
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.itemMeta,
            item.isChecked && styles.itemMetaChecked,
          ]}
        >
          {item.quantity} {item.unit}
        </Text>
      </Pressable>
      <Pressable
        onPress={onDelete}
        disabled={!isEditing}
        style={[
          styles.deleteButton,
          !isEditing && styles.deleteButtonHidden,
        ]}
      >
        <View style={styles.minusIcon} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listName: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  editButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
  },
  editButtonText: {
    fontSize: typography.bodySmall,
    color: colors.primary,
    fontWeight: typography.weightSemibold,
  },
  editButtonTextActive: {
    color: colors.primaryDark,
  },
  menuTrigger: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  menuButton: {
    fontSize: 28,
    color: colors.textSecondary,
  },
  statsBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
  },
  statsText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  addItemContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  addItemInput: {
    marginBottom: 0,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  cancelSearchButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
  },
  cancelSearchText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  suggestionsContainer: {
    marginTop: spacing.sm,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: spacing.xs,
    marginHorizontal: -spacing.xs,
  },
  suggestionChip: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  suggestionText: {
    fontSize: typography.bodySmall,
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
  itemsContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.xxl * 2,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  noResultsTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  noResultsSubtitle: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: typography.h3,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemContentPressed: {
    opacity: 0.7,
  },
  itemName: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: typography.weightMedium,
  },
  itemNameChecked: {
    color: colors.textTertiary,
  },
  itemMeta: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  itemMetaChecked: {
    color: colors.textTertiary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  deleteButtonHidden: {
    opacity: 0,
  },
  minusIcon: {
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.surface,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    position: 'relative',
  },
  menuContainer: {
    position: 'absolute',
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: spacing.xs,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  menuItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuItemText: {
    fontSize: typography.body,
    color: colors.text,
  },
  menuItemDanger: {
    color: colors.error,
    fontWeight: typography.weightSemibold,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.xs,
  },
});
