/**
 * Card Component
 * Reusable card container with shadows
 */

import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { borderRadius, spacing, shadows } from '../../theme';
import { useTheme } from '../../ThemeContext';

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
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }, shadows[elevation], style]}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
});

Card.displayName = 'Card';
