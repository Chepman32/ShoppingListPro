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
import { typography, spacing, borderRadius, shadows } from '../../theme';
import { useTheme } from '../../ThemeContext';

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
  const { theme } = useTheme();
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

  const getContainerStyle = () => {
    const baseStyle: any = {
      ...styles.base,
      ...styles[`${size}Container`],
    };

    if (variant === 'primary') {
      baseStyle.backgroundColor = theme.primary;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = theme.secondary;
    } else if (variant === 'outline') {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = theme.primary;
    } else if (variant === 'ghost') {
      baseStyle.backgroundColor = 'transparent';
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (disabled) {
      return theme.textDisabled;
    }

    if (variant === 'primary' || variant === 'secondary') {
      return '#FFFFFF';
    }

    return theme.primary;
  };

  const containerStyle = [
    getContainerStyle(),
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${size}Text`],
    { color: getTextColor() },
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
});

Button.displayName = 'Button';
