/**
 * About Screen
 * App information and credits
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../../components/core';
import { spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { useTranslation } from 'react-i18next';

export const AboutScreen = () => {
  const navigation = useNavigation();
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation();

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

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
          {t('more.about')}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* App Icon & Name */}
        <View style={styles.appInfo}>
          <View
            style={[styles.appIconContainer, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.appIcon}>🛒</Text>
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>
            ShoppingListPro
          </Text>
          <Text style={[styles.appVersion, { color: theme.textSecondary }]}>
            {t('about.version')} 1.0.0
          </Text>
        </View>

        {/* App Description */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {t('about.description')}
          </Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            {t('about.descriptionText')}
          </Text>
        </Card>

        {/* Features */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {t('about.features')}
          </Text>
          <View style={styles.featuresList}>
            {[
              t('about.feature1'),
              t('about.feature2'),
              t('about.feature3'),
              t('about.feature4'),
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={[styles.featureBullet, { color: theme.primary }]}>
                  •
                </Text>
                <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Credits */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {t('about.credits')}
          </Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            {t('about.developedBy')}
          </Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            {t('about.poweredBy')}
          </Text>
        </Card>

        {/* Legal */}
        <View style={styles.legalSection}>
          <TouchableOpacity>
            <Text style={[styles.legalLink, { color: theme.primary }]}>
              {t('about.privacyPolicy')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.legalLink, { color: theme.primary }]}>
              {t('about.termsOfService')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <Text style={[styles.copyright, { color: theme.textTertiary }]}>
          © 2025 ShoppingListPro. All rights reserved.
        </Text>
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
  appInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  appIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appIcon: {
    fontSize: 56,
  },
  appName: {
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
    marginBottom: spacing.xs,
  },
  appVersion: {
    fontSize: typography.body,
  },
  card: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.md,
  },
  cardText: {
    fontSize: typography.body,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  featuresList: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: typography.h3,
    marginRight: spacing.sm,
    marginTop: -4,
  },
  featureText: {
    flex: 1,
    fontSize: typography.body,
    lineHeight: 22,
  },
  legalSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  legalLink: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  copyright: {
    fontSize: typography.bodySmall,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
