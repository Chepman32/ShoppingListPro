/**
 * Recipes Screen (Premium Feature)
 * Browse and manage recipes
 * Based on SDD Section 6.7
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSettingsStore } from '../../stores';
import { colors, typography, spacing } from '../../theme';

export const RecipesScreen = () => {
  const isPremium = useSettingsStore((state) => state.isPremium);

  if (!isPremium) {
    return (
      <View style={styles.premiumPrompt}>
        <Text style={styles.premiumEmoji}>📖</Text>
        <Text style={styles.premiumTitle}>Premium Feature</Text>
        <Text style={styles.premiumText}>
          Upgrade to Premium to store recipes and add ingredients to your lists!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyEmoji}>👨‍🍳</Text>
        <Text style={styles.emptyText}>No recipes yet</Text>
        <Text style={styles.emptySubtext}>Tap + to add your first recipe</Text>
      </View>
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
  premiumPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  premiumEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  premiumTitle: {
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  premiumText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
