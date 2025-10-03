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
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../../components/core';
import { spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { useTranslation } from 'react-i18next';

export const StatsScreen = () => {
  const navigation = useNavigation();
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

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.primary }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {t('more.stats')}
        </Text>
        <View style={{ width: 32 }} />
      </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 36,
    fontWeight: typography.weightBold,
  },
  title: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
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
