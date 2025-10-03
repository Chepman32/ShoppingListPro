/**
 * Splash Screen Animation
 * Physics-based particle animation with logo breakdown
 * Based on SDD Section 6.1
 */

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {
  Canvas,
  Group,
  Circle,
  LinearGradient,
  vec,
  Fill,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface SplashAnimationProps {
  onComplete: () => void;
}

const generateParticles = (count: number): Particle[] => {
  const colors = [
    '#007AFF', '#34C759', '#FF3B30', '#FF9500', '#5AC8FA',
    '#AF52DE', '#FF2D55', '#5856D6', '#FFD60A', '#00C7BE',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    vx: (Math.random() - 0.5) * 30,
    vy: (Math.random() - 0.5) * 30,
    size: Math.random() * 15 + 5,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

export const SplashAnimation: React.FC<SplashAnimationProps> = ({ onComplete }) => {
  const progress = useSharedValue(0);
  const logoScale = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const logoOpacity = useSharedValue(1);

  const particles = useMemo(() => generateParticles(50), []);

  useEffect(() => {
    // Phase 1: Logo entrance (0-0.8s)
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 800, easing: Easing.out(Easing.exp) }),
      withTiming(1, { duration: 200 })
    );

    logoRotation.value = withTiming(360, {
      duration: 1000,
      easing: Easing.inOut(Easing.quad),
    });

    // Phase 2: Breakdown and reformation (0.8-2.5s)
    progress.value = withDelay(
      800,
      withSequence(
        withTiming(0.5, { duration: 600 }), // Breakdown
        withTiming(1, { duration: 700 })     // Reformation
      )
    );

    logoOpacity.value = withDelay(
      800,
      withSequence(
        withTiming(0, { duration: 300 }),
        withDelay(600, withTiming(1, { duration: 400 }))
      )
    );

    // Complete animation
    const timeout = setTimeout(() => {
      runOnJS(onComplete)();
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  // Calculate particle positions with physics
  const particlePositions = useDerivedValue(() => {
    const t = progress.value;
    const gravity = 9.8;
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;

    return particles.map((p) => {
      if (t < 0.5) {
        // Explosion phase (0-0.5)
        const explosionT = t * 2;
        const x = centerX + p.vx * explosionT * 100;
        const y = centerY + p.vy * explosionT * 100 + gravity * explosionT * explosionT * 50;
        return { x, y, opacity: 1 };
      } else {
        // Reformation phase (0.5-1)
        const reformT = (t - 0.5) * 2;
        const currentX = p.vx * 100;
        const currentY = p.vy * 100 + gravity * 50;
        const x = centerX + currentX * (1 - reformT);
        const y = centerY + currentY * (1 - reformT);
        return { x, y, opacity: 1 - reformT * 0.5 };
      }
    });
  });

  return (
    <Canvas style={styles.canvas}>
      {/* Background Gradient */}
      <Fill>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, SCREEN_HEIGHT)}
          colors={[colors.primary, colors.secondary]}
        />
      </Fill>

      {/* Logo */}
      <Group
        transform={[
          { scale: logoScale.value },
          { rotate: (logoRotation.value * Math.PI) / 180 },
        ]}
        opacity={logoOpacity.value}
      >
        <Circle
          cx={SCREEN_WIDTH / 2}
          cy={SCREEN_HEIGHT / 2}
          r={60}
          color="#6366F1"
        />
        <Circle
          cx={SCREEN_WIDTH / 2}
          cy={SCREEN_HEIGHT / 2}
          r={50}
          color="white"
          opacity={0.3}
        />
      </Group>

      {/* Particles */}
      {particles.map((particle, i) => {
        const pos = particlePositions.value[i];
        return (
          <Circle
            key={particle.id}
            cx={pos.x}
            cy={pos.y}
            r={particle.size}
            color={particle.color}
            opacity={pos.opacity}
          />
        );
      })}
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});
