/**
 * List Detail Screen
 * Shows items in a list with swipe-to-delete and drag-to-reorder
 * Based on SDD Section 6.4
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Input, Checkbox } from '../../components/core';
import { database, List, ListItem } from '../../database';
import { colors, typography, spacing } from '../../theme';
import { Q } from '@nozbe/watermelondb';

export const ListDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { listId } = route.params as { listId: string };

  const [list, setList] = useState<List | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [newItemName, setNewItemName] = useState('');

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

  const handleAddItem = async () => {
    if (!newItemName.trim() || !list) return;

    await database.write(async () => {
      const itemsCollection = database.get<ListItem>('list_items');
      await itemsCollection.create((item) => {
        item.listId = list.id;
        item.name = newItemName.trim();
        item.quantity = 1;
        item.unit = 'unit';
        item.category = 'other';
        item.isChecked = false;
        item.position = items.length;
      });
    });

    setNewItemName('');
    loadListAndItems();
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

  const uncheckedItems = items.filter((i) => !i.isChecked);
  const checkedItems = items.filter((i) => i.isChecked);

  if (!list) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </Pressable>
        <Text style={styles.listName}>{list.name}</Text>
        <Pressable onPress={() => {}}>
          <Text style={styles.menuButton}>⋯</Text>
        </Pressable>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {checkedItems.length} / {items.length} completed
        </Text>
        {items.length > 0 && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(checkedItems.length / items.length) * 100}%`,
                },
              ]}
            />
          </View>
        )}
      </View>

      {/* Add Item Input */}
      <View style={styles.addItemContainer}>
        <Input
          value={newItemName}
          onChangeText={setNewItemName}
          placeholder="Add item..."
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
          style={styles.addItemInput}
        />
      </View>

      {/* Items List */}
      <View style={styles.itemsContainer}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySubtext}>Add your first item above</Text>
          </View>
        ) : (
          <FlashList
            data={[...uncheckedItems, ...checkedItems]}
            renderItem={({ item, index }) => (
              <ItemRow
                item={item}
                index={index}
                onToggle={() => handleToggleItem(item)}
                onDelete={() => handleDeleteItem(item)}
              />
            )}
            estimatedItemSize={80}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </View>
  );
};

const ItemRow: React.FC<{
  item: ListItem;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
}> = ({ item, index, onToggle, onDelete }) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 30)}
      layout={Layout.springify()}
      style={styles.itemRow}
    >
      <Checkbox checked={item.isChecked} onChange={onToggle} />
      <View style={styles.itemContent}>
        <Text
          style={[
            styles.itemName,
            item.isChecked && styles.itemNameChecked,
          ]}
        >
          {item.name}
        </Text>
        <Text style={styles.itemMeta}>
          {item.quantity} {item.unit}
        </Text>
      </View>
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  backButton: {
    fontSize: 36,
    color: colors.primary,
  },
  listName: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
    color: colors.text,
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
  itemsContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.xxl * 2,
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
  itemName: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: typography.weightMedium,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  itemMeta: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteIcon: {
    fontSize: 20,
  },
});
