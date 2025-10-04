/**
 * Favorites Screen
 * Display favorite items and lists
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/core';
import { spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { useTranslation } from 'react-i18next';

export const FavoritesScreen = () => {
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation();

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
        {/* Empty State */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>⭐</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            {t('favorites.noFavorites')}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            {t('favorites.addFavoritesHint')}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: typography.h3,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.body,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
