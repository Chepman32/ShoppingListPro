/**
 * Settings Screen
 * App configuration and preferences
 * Based on SDD Section 6.8
 */

import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../../stores';
import { Card } from '../../components/core';
import { colors, typography, spacing } from '../../theme';

export const SettingsScreen = () => {
  const {
    theme,
    hapticsEnabled,
    soundEnabled,
    isPremium,
    updateSettings,
  } = useSettingsStore();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

      {/* Premium Status */}
      {isPremium && (
        <Card style={styles.premiumCard}>
          <Text style={styles.premiumBadge}>⭐ Premium</Text>
          <Text style={styles.premiumText}>
            You have access to all premium features
          </Text>
        </Card>
      )}

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <Card>
          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Theme</Text>
            <Text style={styles.settingValue}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Text>
          </View>
        </Card>
      </View>

      {/* Behavior */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Behavior</Text>
        <Card>
          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Switch
              value={hapticsEnabled}
              onValueChange={(value) => updateSettings({ hapticsEnabled: value })}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Switch
              value={soundEnabled}
              onValueChange={(value) => updateSettings({ soundEnabled: value })}
            />
          </View>
        </Card>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Card>
          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </Card>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    color: colors.text,
    margin: spacing.lg,
  },
  premiumCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.primary + '20',
  },
  premiumBadge: {
    fontSize: typography.h4,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  premiumText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingLabel: {
    fontSize: typography.body,
    color: colors.text,
  },
  settingValue: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
