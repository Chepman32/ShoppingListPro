/**
 * Pantry Screen
 * Manage pantry items with expiry tracking
 * Based on SDD Section 6.6
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { usePantryStore } from '../../stores';
import { Card } from '../../components/core';
import { colors, typography, spacing } from '../../theme';

export const PantryScreen = () => {
  const { items, expiringItems, lowStockItems, fetchItems } = usePantryStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantry</Text>

      {/* Alerts */}
      {expiringItems.length > 0 && (
        <Card style={styles.alertCard}>
          <Text style={styles.alertText}>
            ⚠️ {expiringItems.length} items expiring soon
          </Text>
        </Card>
      )}

      {lowStockItems.length > 0 && (
        <Card style={styles.alertCard}>
          <Text style={styles.alertText}>
            📦 {lowStockItems.length} items running low
          </Text>
        </Card>
      )}

      {/* Items */}
      <FlashList
        data={items}
        renderItem={({ item }) => (
          <Card style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemMeta}>
              {item.quantity} {item.unit} • {item.location}
            </Text>
          </Card>
        )}
        estimatedItemSize={100}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  alertCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.warning + '20',
  },
  alertText: {
    fontSize: typography.body,
    color: colors.text,
  },
  itemCard: {
    marginBottom: spacing.md,
  },
  itemName: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemMeta: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
});
