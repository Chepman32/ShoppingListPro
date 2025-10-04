/**
 * Stats Screen
 * Display shopping statistics and insights
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

export const StatsScreen = () => {
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation();

  const stats = [
    { label: t('stats.totalLists'), value: '0', icon: '📋' },
    { label: t('stats.totalItems'), value: '0', icon: '🛒' },
    { label: t('stats.completedLists'), value: '0', icon: '✅' },
    { label: t('stats.avgItemsPerList'), value: '0', icon: '📊' },
  ];

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
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card
              key={index}
              style={[styles.statCard, { backgroundColor: theme.surface }]}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {stat.label}
              </Text>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t('stats.recentActivity')}
          </Text>
          <Card style={[styles.activityCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t('stats.noActivity')}
            </Text>
          </Card>
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
    padding: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '48%',
    padding: spacing.lg,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.bodySmall,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.md,
  },
  activityCard: {
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.body,
    textAlign: 'center',
  },
});
