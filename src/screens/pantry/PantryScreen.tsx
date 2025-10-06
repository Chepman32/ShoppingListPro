/**
 * Pantry Screen
 * Manage pantry items with expiry tracking
 * Based on SDD Section 6.6
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, Modal, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInDown, FadeOutLeft, Layout } from 'react-native-reanimated';
import { usePantryStore } from '../../stores';
import { Card, Button, Input } from '../../components/core';
import { typography, spacing, borderRadius } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { PantryItem } from '../../database';
import { CreatePantryItemData } from '../../types/database';

const LOCATIONS = ['fridge', 'pantry', 'freezer'] as const;
const CATEGORIES = ['produce', 'dairy', 'meat', 'bakery', 'frozen', 'pantry', 'beverages', 'snacks', 'other'] as const;
const UNITS = ['pcs', 'kg', 'g', 'l', 'ml', 'lb', 'oz', 'cup', 'tbsp', 'tsp'] as const;

export const PantryScreen = () => {
  const { items, expiringItems, lowStockItems, fetchItems, deleteItem, consumeItem } = usePantryStore();
  const { theme } = useTheme();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'expiring' | 'low'>('all');

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = filter === 'all'
    ? items
    : filter === 'expiring'
    ? expiringItems
    : lowStockItems;

  const handleAddItem = () => {
    setIsAddModalVisible(true);
  };

  const handleEditItem = (item: PantryItem) => {
    setSelectedItem(item);
    setIsEditModalVisible(true);
  };

  const handleDeleteItem = (item: PantryItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteItem(item.id)
        }
      ]
    );
  };

  const handleConsumeItem = (item: PantryItem) => {
    Alert.alert(
      'Consume Item',
      `How much ${item.unit} would you like to consume?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '1', onPress: () => consumeItem(item.id, 1) },
        { text: '5', onPress: () => consumeItem(item.id, 5) },
        { text: 'All', onPress: () => consumeItem(item.id, item.quantity) }
      ]
    );
  };

  const getDaysUntilExpiry = (item: PantryItem): number | null => {
    if (!item.expiryDate) return null;
    return Math.floor((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getExpiryColor = (item: PantryItem): string => {
    if (item.isExpired) return theme.error;
    if (item.isExpiring) return theme.warning;
    return theme.textTertiary;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Pantry</Text>
        <Pressable onPress={handleAddItem} style={[styles.addButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Alerts */}
      {expiringItems.length > 0 && (
        <Pressable onPress={() => setFilter('expiring')}>
          <Card style={[styles.alertCard, { backgroundColor: theme.warning + '20' }]}>
            <Text style={[styles.alertText, { color: theme.text }]}>
              ⚠️ {expiringItems.length} items expiring soon
            </Text>
          </Card>
        </Pressable>
      )}

      {lowStockItems.length > 0 && (
        <Pressable onPress={() => setFilter('low')}>
          <Card style={[styles.alertCard, { backgroundColor: theme.info + '20' }]}>
            <Text style={[styles.alertText, { color: theme.text }]}>
              📦 {lowStockItems.length} items running low
            </Text>
          </Card>
        </Pressable>
      )}

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        <FilterPill label="All" count={items.length} active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterPill label="Expiring" count={expiringItems.length} active={filter === 'expiring'} onPress={() => setFilter('expiring')} />
        <FilterPill label="Low Stock" count={lowStockItems.length} active={filter === 'low'} onPress={() => setFilter('low')} />
      </View>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏪</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>No items in pantry</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Tap + to add your first item
          </Text>
        </View>
      ) : (
        <FlashList
          data={filteredItems}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 50)}
              exiting={FadeOutLeft}
              layout={Layout.springify()}
            >
              <Pressable onPress={() => handleEditItem(item)} onLongPress={() => handleConsumeItem(item)}>
                <Card style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                      <Text style={[styles.itemCategory, { color: theme.textTertiary }]}>
                        {item.category}
                      </Text>
                    </View>
                    <View style={styles.itemBadges}>
                      {item.isExpired && <Text style={styles.expiredBadge}>Expired</Text>}
                      {item.isExpiring && !item.isExpired && <Text style={styles.expiringBadge}>Soon</Text>}
                      {item.isLowStock && <Text style={styles.lowStockBadge}>Low</Text>}
                    </View>
                  </View>

                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>
                      📦 {item.quantity} {item.unit}
                    </Text>
                    <Text style={[styles.itemLocation, { color: theme.textSecondary }]}>
                      📍 {item.location}
                    </Text>
                  </View>

                  {item.expiryDate && (
                    <Text style={[styles.itemExpiry, { color: getExpiryColor(item) }]}>
                      {item.isExpired
                        ? `⏱️ Expired ${Math.abs(getDaysUntilExpiry(item) || 0)} days ago`
                        : `⏱️ Expires in ${getDaysUntilExpiry(item)} days`
                      }
                    </Text>
                  )}

                  <View style={styles.itemActions}>
                    <Button variant="ghost" size="small" onPress={() => handleConsumeItem(item)}>
                      Use
                    </Button>
                    <Button variant="ghost" size="small" onPress={() => handleEditItem(item)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="small" onPress={() => handleDeleteItem(item)}>
                      Delete
                    </Button>
                  </View>
                </Card>
              </Pressable>
            </Animated.View>
          )}
          estimatedItemSize={180}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Add/Edit Modals */}
      <AddItemModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
      />
      <EditItemModal
        visible={isEditModalVisible}
        item={selectedItem}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedItem(null);
        }}
      />
    </SafeAreaView>
  );
};

const FilterPill: React.FC<{
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}> = ({ label, count, active, onPress }) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterPill,
        {
          backgroundColor: active ? theme.primary : theme.surface,
          borderColor: theme.border
        }
      ]}
    >
      <Text style={[
        styles.filterPillText,
        { color: active ? '#FFFFFF' : theme.textSecondary }
      ]}>
        {label} ({count})
      </Text>
    </Pressable>
  );
};

const AddItemModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { addItem } = usePantryStore();

  const [formData, setFormData] = useState<CreatePantryItemData>({
    name: '',
    category: 'other',
    quantity: 1,
    unit: 'pcs',
    location: 'pantry',
    lowStockThreshold: 1,
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    try {
      await addItem(formData);
      setFormData({
        name: '',
        category: 'other',
        quantity: 1,
        unit: 'pcs',
        location: 'pantry',
        lowStockThreshold: 1,
      });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add item');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Add Pantry Item</Text>
          <Pressable onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.primary }]}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.modalContent}>
          <Input
            label="Item Name"
            value={formData.name}
            onChangeText={(name) => setFormData({ ...formData, name })}
            placeholder="e.g., Milk, Eggs, Bread"
          />

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Category</Text>
          <View style={styles.optionsGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setFormData({ ...formData, category: cat })}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: formData.category === cat ? theme.primary : theme.surface,
                    borderColor: theme.border
                  }
                ]}
              >
                <Text style={[
                  styles.optionText,
                  { color: formData.category === cat ? '#FFFFFF' : theme.textSecondary }
                ]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Quantity"
                value={String(formData.quantity)}
                onChangeText={(q) => setFormData({ ...formData, quantity: Number(q) || 0 })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Unit</Text>
              <View style={styles.optionsRow}>
                {UNITS.slice(0, 3).map((u) => (
                  <Pressable
                    key={u}
                    onPress={() => setFormData({ ...formData, unit: u })}
                    style={[
                      styles.smallOptionButton,
                      {
                        backgroundColor: formData.unit === u ? theme.primary : theme.surface,
                        borderColor: theme.border
                      }
                    ]}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: formData.unit === u ? '#FFFFFF' : theme.textSecondary }
                    ]}>
                      {u}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Location</Text>
          <View style={styles.optionsRow}>
            {LOCATIONS.map((loc) => (
              <Pressable
                key={loc}
                onPress={() => setFormData({ ...formData, location: loc })}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: formData.location === loc ? theme.primary : theme.surface,
                    borderColor: theme.border
                  }
                ]}
              >
                <Text style={[
                  styles.optionText,
                  { color: formData.location === loc ? '#FFFFFF' : theme.textSecondary }
                ]}>
                  {loc}
                </Text>
              </Pressable>
            ))}
          </View>

          <Input
            label="Low Stock Threshold"
            value={String(formData.lowStockThreshold)}
            onChangeText={(t) => setFormData({ ...formData, lowStockThreshold: Number(t) || 1 })}
            keyboardType="numeric"
          />

          <Input
            label="Notes (optional)"
            value={formData.notes || ''}
            onChangeText={(notes) => setFormData({ ...formData, notes })}
            multiline
            numberOfLines={3}
          />
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button variant="outline" onPress={onClose} style={styles.modalButton}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} style={styles.modalButton}>
            Add Item
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const EditItemModal: React.FC<{
  visible: boolean;
  item: PantryItem | null;
  onClose: () => void;
}> = ({ visible, item, onClose }) => {
  const { theme } = useTheme();
  const { updateItem, replenishItem } = usePantryStore();

  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    quantity: 1,
    unit: 'pcs',
    location: 'pantry',
    lowStockThreshold: 1,
    notes: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        location: item.location,
        lowStockThreshold: item.lowStockThreshold,
        notes: item.notes || '',
      });
    }
  }, [item]);

  const handleSubmit = async () => {
    if (!item) return;

    try {
      await updateItem(item.id, formData);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const handleReplenish = () => {
    if (!item) return;

    Alert.alert(
      'Replenish Stock',
      'How many would you like to add?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '+1', onPress: () => replenishItem(item.id, 1) },
        { text: '+5', onPress: () => replenishItem(item.id, 5) },
        { text: '+10', onPress: () => replenishItem(item.id, 10) }
      ]
    );
  };

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Item</Text>
          <Pressable onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.primary }]}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.modalContent}>
          <Input
            label="Item Name"
            value={formData.name}
            onChangeText={(name) => setFormData({ ...formData, name })}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Quantity"
                value={String(formData.quantity)}
                onChangeText={(q) => setFormData({ ...formData, quantity: Number(q) || 0 })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidth}>
              <Button onPress={handleReplenish} style={{ marginTop: spacing.lg }}>
                Replenish
              </Button>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Location</Text>
          <View style={styles.optionsRow}>
            {LOCATIONS.map((loc) => (
              <Pressable
                key={loc}
                onPress={() => setFormData({ ...formData, location: loc })}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: formData.location === loc ? theme.primary : theme.surface,
                    borderColor: theme.border
                  }
                ]}
              >
                <Text style={[
                  styles.optionText,
                  { color: formData.location === loc ? '#FFFFFF' : theme.textSecondary }
                ]}>
                  {loc}
                </Text>
              </Pressable>
            ))}
          </View>

          <Input
            label="Notes"
            value={formData.notes}
            onChangeText={(notes) => setFormData({ ...formData, notes })}
            multiline
            numberOfLines={3}
          />
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button variant="outline" onPress={onClose} style={styles.modalButton}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} style={styles.modalButton}>
            Save Changes
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: typography.weightBold,
  },
  alertCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  alertText: {
    fontSize: typography.body,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.weightMedium,
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
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.body,
  },
  itemCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.xs,
  },
  itemCategory: {
    fontSize: typography.caption,
    textTransform: 'capitalize',
  },
  itemBadges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  expiredBadge: {
    fontSize: typography.caption,
    color: '#FFFFFF',
    backgroundColor: '#FF3B30',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  expiringBadge: {
    fontSize: typography.caption,
    color: '#FFFFFF',
    backgroundColor: '#FF9500',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  lowStockBadge: {
    fontSize: typography.caption,
    color: '#FFFFFF',
    backgroundColor: '#5AC8FA',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  itemDetails: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  itemQuantity: {
    fontSize: typography.bodySmall,
  },
  itemLocation: {
    fontSize: typography.bodySmall,
    textTransform: 'capitalize',
  },
  itemExpiry: {
    fontSize: typography.bodySmall,
    marginBottom: spacing.sm,
  },
  itemActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
  },
  closeButton: {
    fontSize: 32,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  modalButton: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: typography.bodySmall,
    fontWeight: typography.weightMedium,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  smallOptionButton: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontSize: typography.bodySmall,
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
});
