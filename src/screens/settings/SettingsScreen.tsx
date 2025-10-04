/**
 * Settings Screen
 * App configuration and preferences
 * Based on SDD Section 6.8
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore, Language } from '../../stores/settingsStore';
import { Card } from '../../components/core';
import { colors, typography, spacing } from '../../theme';
import { ThemeMode } from '../../theme/themes';
import { useTheme } from '../../ThemeContext';
import { useTranslation } from 'react-i18next';

const themes: { mode: ThemeMode; name: string; description: string }[] = [
  { mode: 'light', name: 'Light', description: 'Classic light theme' },
  { mode: 'dark', name: 'Dark', description: 'Easy on the eyes' },
  { mode: 'solar', name: 'Solar', description: 'Warm yellow shades' },
  { mode: 'mono', name: 'Mono', description: 'Grayscale simplicity' },
];

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'sp', name: 'Spanish', nativeName: 'Español' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'por', name: 'Portuguese', nativeName: 'Português' },
  { code: 'jp', name: 'Japanese', nativeName: '日本語' },
  { code: 'ch', name: 'Chinese', nativeName: '中文' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ua', name: 'Ukrainian', nativeName: 'Українська' },
];

export const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const { theme: currentTheme, themeMode } = useTheme();
  const {
    language,
    hapticsEnabled,
    soundEnabled,
    setThemeMode,
    setLanguage,
    toggleHaptics,
    toggleSound,
  } = useSettingsStore();

  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    setShowThemePicker(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setShowLanguagePicker(false);
  };

  const selectedTheme = themes.find((t) => t.mode === themeMode);
  const selectedLanguage = languages.find((l) => l.code === language);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { backgroundColor: currentTheme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: currentTheme.text }]}>{t('settings.title')}</Text>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
            {t('settings.appearance.title')}
          </Text>
          <Card style={{ backgroundColor: currentTheme.surface }}>
            <TouchableOpacity
              style={styles.setting}
              onPress={() => setShowThemePicker(true)}
            >
              <Text style={[styles.settingLabel, { color: currentTheme.text }]}>
                {t('settings.appearance.theme')}
              </Text>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: currentTheme.textSecondary }]}>
                  {selectedTheme?.name}
                </Text>
                <Text style={[styles.chevron, { color: currentTheme.textTertiary }]}>›</Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: currentTheme.borderLight }]} />
            <TouchableOpacity
              style={styles.setting}
              onPress={() => setShowLanguagePicker(true)}
            >
              <Text style={[styles.settingLabel, { color: currentTheme.text }]}>
                {t('settings.appearance.language')}
              </Text>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: currentTheme.textSecondary }]}>
                  {selectedLanguage?.nativeName}
                </Text>
                <Text style={[styles.chevron, { color: currentTheme.textTertiary }]}>›</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Behavior */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
            {t('settings.behavior.title')}
          </Text>
          <Card style={{ backgroundColor: currentTheme.surface }}>
            <View style={styles.setting}>
              <Text style={[styles.settingLabel, { color: currentTheme.text }]}>
                {t('settings.behavior.haptics')}
              </Text>
              <Switch
                value={hapticsEnabled}
                onValueChange={toggleHaptics}
                trackColor={{ false: currentTheme.borderLight, true: currentTheme.primary }}
                thumbColor={hapticsEnabled ? currentTheme.primary : currentTheme.border}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: currentTheme.borderLight }]} />
            <View style={styles.setting}>
              <Text style={[styles.settingLabel, { color: currentTheme.text }]}>
                {t('settings.behavior.sound')}
              </Text>
              <Switch
                value={soundEnabled}
                onValueChange={toggleSound}
                trackColor={{ false: currentTheme.borderLight, true: currentTheme.primary }}
                thumbColor={soundEnabled ? currentTheme.primary : currentTheme.border}
              />
            </View>
          </Card>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
            {t('settings.data.title')}
          </Text>
          <Card style={{ backgroundColor: currentTheme.surface }}>
            <TouchableOpacity
              style={styles.setting}
              onPress={() => {
                // TODO: Implement export stats functionality
                alert('Export Stats feature coming soon!');
              }}
            >
              <Text style={[styles.settingLabel, { color: currentTheme.text }]}>
                {t('settings.data.exportStats')}
              </Text>
              <Text style={[styles.chevron, { color: currentTheme.textTertiary }]}>›</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
            {t('settings.about.title')}
          </Text>
          <Card style={{ backgroundColor: currentTheme.surface }}>
            <View style={styles.setting}>
              <Text style={[styles.settingLabel, { color: currentTheme.text }]}>
                {t('settings.about.version')}
              </Text>
              <Text style={[styles.settingValue, { color: currentTheme.textSecondary }]}>
                1.0.0
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Theme Picker Modal */}
      <Modal
        visible={showThemePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowThemePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: currentTheme.borderLight }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
                {t('settings.appearance.selectTheme')}
              </Text>
              <TouchableOpacity onPress={() => setShowThemePicker(false)}>
                <Text style={[styles.modalClose, { color: currentTheme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {themes.map((theme) => (
                <Pressable
                  key={theme.mode}
                  onPress={() => handleThemeChange(theme.mode)}
                >
                  <Card
                    style={[
                      styles.themeOption,
                      { backgroundColor: currentTheme.surface },
                      theme.mode === themeMode && {
                        borderColor: currentTheme.primary,
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <Text style={[styles.themeName, { color: currentTheme.text }]}>
                      {theme.name}
                    </Text>
                    <Text style={[styles.themeDescription, { color: currentTheme.textSecondary }]}>
                      {theme.description}
                    </Text>
                  </Card>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Language Picker Modal */}
      <Modal
        visible={showLanguagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: currentTheme.borderLight }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
                {t('settings.appearance.selectLanguage')}
              </Text>
              <TouchableOpacity onPress={() => setShowLanguagePicker(false)}>
                <Text style={[styles.modalClose, { color: currentTheme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {languages.map((lang) => (
                <Pressable
                  key={lang.code}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <Card
                    style={[
                      styles.languageOption,
                      { backgroundColor: currentTheme.surface },
                      lang.code === language && {
                        borderColor: currentTheme.primary,
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <Text style={[styles.languageName, { color: currentTheme.text }]}>
                      {lang.nativeName}
                    </Text>
                    <Text style={[styles.languageSubname, { color: currentTheme.textSecondary }]}>
                      {lang.name}
                    </Text>
                  </Card>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
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
  },
  settingValue: {
    fontSize: typography.body,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chevron: {
    fontSize: 24,
  },
  divider: {
    height: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
  },
  modalClose: {
    fontSize: 28,
  },
  modalScroll: {
    padding: spacing.lg,
  },
  themeOption: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  themeName: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.xs,
  },
  themeDescription: {
    fontSize: typography.body,
  },
  languageOption: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  languageName: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.xs / 2,
  },
  languageSubname: {
    fontSize: typography.bodySmall,
  },
});
