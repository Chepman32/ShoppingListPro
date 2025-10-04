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
import { colors, typography, spacing } from '../../theme';
import { Template } from '../../types/database';

export const TemplatesScreen = () => {
  const navigation = useNavigation();
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
          <Text style={styles.templateName}>{item.name}</Text>
          {item.isPredefined && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Built-in</Text>
            </View>
          )}
        </View>
        <Text style={styles.templateMeta}>
          {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const renderEmptySection = (section: any) => {
    if (!section.isEmpty) return null;

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No custom templates yet</Text>
        <TouchableOpacity onPress={handleCreatePress} style={styles.emptyButton}>
          <Text style={styles.emptyButtonText}>Create your first template</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Templates</Text>
        <Text style={styles.subtitle}>
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
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
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
    color: colors.text,
  },
  createButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 16,
  },
  createButtonText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.weightSemibold,
    color: colors.background,
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
    color: colors.text,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  badgeText: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
    color: colors.primary,
  },
  templateMeta: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  emptyButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
    color: colors.background,
  },
});
