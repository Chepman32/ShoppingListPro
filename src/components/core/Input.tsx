/**
 * Input Component
 * Themed text input with label
 */

import React, { memo } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = memo<InputProps>(({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: typography.weightMedium,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    fontSize: typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

Input.displayName = 'Input';
