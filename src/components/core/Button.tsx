/**
 * Animated Button Component
 * Reusable button with haptic feedback and animations
 */

import React, { memo, useCallback } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button = memo<ButtonProps>(({
  onPress,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  style,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 10 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 10 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const containerStyle = [
    styles.base,
    styles[`${variant}Container`],
    styles[`${size}Container`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={containerStyle}
      >
        <Text style={textStyle}>{children}</Text>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  fullWidth: {
    width: '100%',
  },

  // Variants
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  secondaryContainer: {
    backgroundColor: colors.secondary,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },

  // Sizes
  smallContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mediumContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  largeContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  // Text
  text: {
    fontWeight: typography.weightSemibold,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },

  // Text sizes
  smallText: {
    fontSize: typography.bodySmall,
  },
  mediumText: {
    fontSize: typography.body,
  },
  largeText: {
    fontSize: typography.h4,
  },

  // Disabled
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textDisabled,
  },
});

Button.displayName = 'Button';
