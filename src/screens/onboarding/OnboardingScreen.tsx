/**
 * Onboarding Screen
 * 4-screen onboarding flow based on SDD Section 6.2
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ViewToken } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Button } from '../../components/core';
import { colors, typography, spacing } from '../../theme';
import { useSettingsStore } from '../../stores';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to ListFlow',
    subtitle: 'Shopping lists made delightful',
    emoji: '🛒',
  },
  {
    id: '2',
    title: 'Smart Organization',
    subtitle: 'Categories, pantry, and recipes all in one place',
    emoji: '📋',
  },
  {
    id: '3',
    title: 'Beautiful Design',
    subtitle: 'Every interaction feels alive with fluid animations',
    emoji: '✨',
  },
  {
    id: '4',
    title: '100% Offline',
    subtitle: 'No internet required. Your data stays on your device.',
    emoji: '🔒',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
      onComplete();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    onComplete();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const renderItem = ({ item, index }: { item: typeof onboardingData[0]; index: number }) => {
    return <OnboardingPage item={item} index={index} scrollX={scrollX} />;
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <PaginationDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        <View style={styles.buttons}>
          {currentIndex < onboardingData.length - 1 && (
            <Button variant="ghost" onPress={handleSkip}>
              Skip
            </Button>
          )}
          <Button onPress={handleNext} fullWidth={currentIndex === onboardingData.length - 1}>
            {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          </Button>
        </View>
      </View>
    </View>
  );
};

const OnboardingPage: React.FC<{
  item: typeof onboardingData[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}> = ({ item, index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.page}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </View>
  );
};

const PaginationDot: React.FC<{ index: number; scrollX: Animated.SharedValue<number> }> = ({
  index,
  scrollX,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );

    return { width, opacity };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emoji: {
    fontSize: 120,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
