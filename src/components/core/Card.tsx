/**
 * Card Component
 * Reusable card container with shadows
 */

import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  elevation?: 'sm' | 'md' | 'lg';
}

export const Card = memo<CardProps>(({
  children,
  style,
  elevation = 'md',
}) => {
  return (
    <View style={[styles.card, shadows[elevation], style]}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
});

Card.displayName = 'Card';
