/**
 * More Screen
 * Hub for Settings, Favorites, Stats, and About
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../../components/core';
import { spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { useTranslation } from 'react-i18next';

interface MoreOption {
  id: string;
  title: string;
  icon: string;
  screen: string;
  description?: string;
}

export const MoreScreen = () => {
  const navigation = useNavigation();
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation();

  const options: MoreOption[] = [
    {
      id: 'settings',
      title: t('more.settings'),
      icon: '⚙️',
      screen: 'Settings',
      description: t('more.settingsDesc'),
    },
    {
      id: 'favorites',
      title: t('more.favorites'),
      icon: '⭐',
      screen: 'Favorites',
      description: t('more.favoritesDesc'),
    },
    {
      id: 'stats',
      title: t('more.stats'),
      icon: '📊',
      screen: 'Stats',
      description: t('more.statsDesc'),
    },
    {
      id: 'about',
      title: t('more.about'),
      icon: 'ℹ️',
      screen: 'About',
      description: t('more.aboutDesc'),
    },
  ];

  const handleOptionPress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          {t('more.title')}
        </Text>

        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleOptionPress(option.screen)}
              activeOpacity={0.7}
            >
              <Card style={[styles.optionCard, { backgroundColor: theme.surface }]}>
                <View style={styles.optionContent}>
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: theme.primary + '20' },
                      ]}
                    >
                      <Text style={styles.icon}>{option.icon}</Text>
                    </View>
                    <View style={styles.optionText}>
                      <Text style={[styles.optionTitle, { color: theme.text }]}>
                        {option.title}
                      </Text>
                      {option.description && (
                        <Text
                          style={[
                            styles.optionDescription,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {option.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={[styles.chevron, { color: theme.textTertiary }]}>
                    ›
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textTertiary }]}>
            ShoppingListPro v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    margin: spacing.lg,
  },
  optionsContainer: {
    paddingHorizontal: spacing.lg,
  },
  optionCard: {
    marginBottom: spacing.md,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.xs / 2,
  },
  optionDescription: {
    fontSize: typography.bodySmall,
  },
  chevron: {
    fontSize: 32,
    marginLeft: spacing.sm,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.bodySmall,
  },
});
