/**
 * Shopping Mode Screen
 * Full-screen, high-contrast mode for in-store shopping
 * Based on SDD Section 6.5
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { database, List, ListItem } from '../../database';
import { colors, typography, spacing } from '../../theme';
import { Q } from '@nozbe/watermelondb';

export const ShoppingModeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { listId } = route.params as { listId: string };

  const [list, setList] = useState<List | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, [listId]);

  const loadData = async () => {
    const loadedList = await database.get<List>('lists').find(listId);
    setList(loadedList);

    const uncheckedItems = await loadedList.items
      .extend(Q.where('is_checked', false), Q.sortBy('position', Q.asc))
      .fetch();
    setItems(uncheckedItems);
  };

  const handleCheck = async () => {
    if (currentIndex >= items.length) return;

    const item = items[currentIndex];
    await item.check();

    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All items checked - show completion
      navigation.goBack();
    }
  };

  const handleSkip = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentItem = items[currentIndex];
  const progress = items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0;

  if (!list || !currentItem) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>All items checked!</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.doneButton}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </Pressable>
        <Text style={styles.listName}>{list.name}</Text>
        <Text style={styles.progress}>
          {currentIndex + 1} / {items.length}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Item Display */}
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{currentItem.name}</Text>
        <Text style={styles.itemQuantity}>
          {currentItem.quantity} {currentItem.unit}
        </Text>
        {currentItem.notes && (
          <Text style={styles.itemNotes}>{currentItem.notes}</Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </Pressable>
        <Pressable onPress={handleCheck} style={styles.checkButton}>
          <Text style={styles.checkButtonText}>✓ Got It</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  closeButton: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  listName: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    color: '#FFFFFF',
  },
  progress: {
    fontSize: typography.body,
    color: '#FFFFFF',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#333333',
    marginHorizontal: spacing.lg,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  itemName: {
    fontSize: 48,
    fontWeight: typography.weightBold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  itemQuantity: {
    fontSize: 32,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  itemNotes: {
    fontSize: typography.body,
    color: '#999999',
    textAlign: 'center',
    marginTop: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  skipButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    backgroundColor: '#333333',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: typography.h4,
    color: '#FFFFFF',
    fontWeight: typography.weightSemibold,
  },
  checkButton: {
    flex: 2,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
  },
  checkButtonText: {
    fontSize: typography.h4,
    color: '#FFFFFF',
    fontWeight: typography.weightBold,
  },
  message: {
    fontSize: typography.h2,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: spacing.xxl * 3,
  },
  doneButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: typography.h3,
    color: '#FFFFFF',
    fontWeight: typography.weightBold,
  },
});
