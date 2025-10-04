/**
 * Animated Checkbox Component
 * Based on SDD Section 7.2 - Checkbox Toggle Animation
 */

import React, { memo, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Canvas, Path, Circle, Skia } from '@shopify/react-native-skia';
import { colors } from '../../theme';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
  color?: string;
  uncheckedColor?: string;
}

export const Checkbox = memo<CheckboxProps>(({ 
  checked,
  onChange,
  size = 36,
  color = colors.primary,
  uncheckedColor = colors.borderLight,
}) => {
  const progress = useSharedValue(checked ? 1 : 0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 300 });
    rotation.value = checked
      ? withSequence(
          withTiming(15, { duration: 100 }),
          withTiming(-15, { duration: 100 }),
          withTiming(0, { duration: 100 })
        )
      : withTiming(0, { duration: 100 });
  }, [checked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const checkmarkPath = Skia.Path.Make();
  checkmarkPath.moveTo(size * 0.25, size * 0.5);
  checkmarkPath.lineTo(size * 0.4, size * 0.65);
  checkmarkPath.lineTo(size * 0.75, size * 0.35);

  return (
    <Pressable onPress={() => onChange(!checked)}>
      <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
        <Canvas style={{ width: size, height: size }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            color={checked ? color : colors.surface}
            style="fill"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            color={checked ? color : uncheckedColor}
            style="stroke"
            strokeWidth={checked ? 0 : 2}
          />
          {checked && (
            <Path
              path={checkmarkPath}
              color="#FFFFFF"
              style="stroke"
              strokeWidth={3}
              strokeCap="round"
              strokeJoin="round"
            />
          )}
        </Canvas>
      </Animated.View>
    </Pressable>
  );
});

Checkbox.displayName = 'Checkbox';
