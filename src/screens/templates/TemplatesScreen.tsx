/**
 * Templates Screen
 * Browse and manage shopping list templates
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTemplatesStore } from '../../stores';
import { Card } from '../../components/core';
import { typography, spacing } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { Template } from '../../types/database';

export const TemplatesScreen = () => {
  const navigation = useNavigation();
  const { theme, themeMode } = useTheme();
  const { templates, loading, fetchTemplates, getPredefinedTemplates, getUserTemplates } =
    useTemplatesStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const predefinedTemplates = getPredefinedTemplates();
  const userTemplates = getUserTemplates();

  const sections = [
    {
      title: 'My Templates',
      data: userTemplates,
      isEmpty: userTemplates.length === 0,
    },
    {
      title: 'Predefined Templates',
      data: predefinedTemplates,
    },
  ];

  const handleTemplatePress = (template: Template) => {
    navigation.navigate('TemplateDetail' as never, { templateId: template.id } as never);
  };

  const handleCreatePress = () => {
    navigation.navigate('CreateTemplate' as never);
  };

  const renderTemplate = ({ item }: { item: Template }) => (
    <TouchableOpacity onPress={() => handleTemplatePress(item)}>
      <Card style={styles.templateCard}>
        <View style={styles.templateHeader}>
          <Text style={[styles.templateName, { color: theme.textSecondary }]}>{item.name}</Text>
          {item.isPredefined && (
            <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: theme.primary }]}>Built-in</Text>
            </View>
          )}
        </View>
        <Text style={[styles.templateMeta, { color: theme.textTertiary }]}>
          {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
    </View>
  );

  const renderEmptySection = (section: any) => {
    if (!section.isEmpty) return null;

    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No custom templates yet</Text>
        <TouchableOpacity onPress={handleCreatePress} style={[styles.emptyButton, { backgroundColor: theme.primary }]}>
          <Text style={[styles.emptyButtonText, { color: theme.background }]}>Create your first template</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={themeMode === 'dark' || themeMode === 'mono' ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Templates</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Quick-add recurring items to your lists
        </Text>
      </View>

      <SectionList
        sections={sections}
        renderItem={({ item, section }) =>
          section.isEmpty ? null : renderTemplate({ item })
        }
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={({ section }) => renderEmptySection(section)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightSemibold,
  },
  createButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  createButtonText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.weightSemibold,
  },
  templateCard: {
    marginBottom: spacing.md,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  templateName: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  badgeText: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
  },
  templateMeta: {
    fontSize: typography.bodySmall,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body,
    marginBottom: spacing.md,
  },
  emptyButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
  },
});
