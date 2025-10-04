/**
 * Recents Screen
 * Display recently accessed items
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../../components/core';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRecentsStore } from '../../stores/recentsStore';
import type {
  RecentListEntry,
  RecentTemplateEntry,
  RecentProductEntry,
  RecentMealPlanEntry,
} from '../../types/recents';

const formatAccessedDate = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

const buildProductMeta = (recent: RecentProductEntry) => {
  const parts: string[] = [];
  const { quantity, unit } = recent.product;

  if (quantity && unit) {
    parts.push(`${quantity} ${unit}`);
  } else if (quantity) {
    parts.push(quantity);
  }

  if (recent.sourceListName) {
    parts.push(recent.sourceListName);
  }

  return parts.join(' • ');
};

export const RecentsScreen = () => {
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const recents = useRecentsStore((state) => state.recents);
  const clearRecents = useRecentsStore((state) => state.clearRecents);

  const { listRecents, templateRecents, productRecents, mealPlanRecents } = useMemo(() => {
    const lists: RecentListEntry[] = [];
    const templates: RecentTemplateEntry[] = [];
    const products: RecentProductEntry[] = [];
    const mealPlans: RecentMealPlanEntry[] = [];

    recents.forEach((recent) => {
      if (recent.type === 'list') {
        lists.push(recent);
      } else if (recent.type === 'template') {
        templates.push(recent);
      } else if (recent.type === 'product') {
        products.push(recent);
      } else if (recent.type === 'mealPlan') {
        mealPlans.push(recent);
      }
    });

    return {
      listRecents: lists,
      templateRecents: templates,
      productRecents: products,
      mealPlanRecents: mealPlans,
    };
  }, [recents]);

  const hasRecents =
    listRecents.length > 0 ||
    templateRecents.length > 0 ||
    productRecents.length > 0 ||
    mealPlanRecents.length > 0;

  const handleListPress = (recent: RecentListEntry) => {
    (navigation as any).navigate('Lists', {
      screen: 'ListDetail',
      params: { listId: recent.id },
    });
  };

  const handleTemplatePress = (recent: RecentTemplateEntry) => {
    (navigation as any).navigate('Templates', {
      screen: 'TemplateDetail',
      params: { templateId: recent.id },
    });
  };

  const handleProductPress = (recent: RecentProductEntry) => {
    if (recent.sourceListId) {
      (navigation as any).navigate('Lists', {
        screen: 'Product',
        params: {
          listId: recent.sourceListId,
          product: recent.product,
        },
      });
    }
  };

  const handleMealPlanPress = () => {
    (navigation as any).navigate('MealPlan');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {!hasRecents ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🕒</Text>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No recent items
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Items you open will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.sectionsContainer}>
            <View style={styles.headerRow}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Recent Items ({recents.length})
              </Text>
              <Pressable onPress={clearRecents}>
                <Text style={[styles.clearButton, { color: theme.primary }]}>
                  Clear All
                </Text>
              </Pressable>
            </View>

            {listRecents.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Lists
                </Text>
                {listRecents.map((recent) => {
                  const formattedDate = formatAccessedDate(recent.accessedAt);

                  return (
                    <Pressable key={recent.id} onPress={() => handleListPress(recent)}>
                      <Card
                        style={[styles.recentCard, { backgroundColor: theme.surface }]}
                      >
                        <View style={styles.recentRow}>
                          <View
                            style={[
                              styles.listIconContainer,
                              { backgroundColor: recent.color ?? colors.primary + '20' },
                            ]}
                          >
                            <Text style={styles.listIcon}>{recent.icon ?? '🛒'}</Text>
                          </View>
                          <View style={styles.recentContent}>
                            <Text style={[styles.recentTitle, { color: theme.text }]}>
                              {recent.name}
                            </Text>
                            {formattedDate && (
                              <Text style={[styles.recentSubtitle, { color: theme.textSecondary }]}>
                                {formattedDate}
                              </Text>
                            )}
                          </View>
                          <Text style={[styles.chevron, { color: theme.textTertiary }]}>›</Text>
                        </View>
                      </Card>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {templateRecents.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Templates
                </Text>
                {templateRecents.map((recent) => (
                  <Pressable key={recent.id} onPress={() => handleTemplatePress(recent)}>
                    <Card
                      style={[styles.recentCard, { backgroundColor: theme.surface }]}
                    >
                      <View style={styles.recentRow}>
                        <View style={styles.templateBadge}>
                          <Text style={styles.templateEmoji}>📋</Text>
                        </View>
                        <View style={styles.recentContent}>
                          <Text style={[styles.recentTitle, { color: theme.text }]}>
                            {recent.name}
                          </Text>
                          <Text style={[styles.recentSubtitle, { color: theme.textSecondary }]}>
                            {formatAccessedDate(recent.accessedAt)}
                          </Text>
                        </View>
                        <Text style={[styles.chevron, { color: theme.textTertiary }]}>›</Text>
                      </View>
                    </Card>
                  </Pressable>
                ))}
              </View>
            )}

            {productRecents.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Products
                </Text>
                {productRecents.map((recent) => {
                  const productMeta = buildProductMeta(recent);

                  return (
                    <Pressable key={recent.id} onPress={() => handleProductPress(recent)}>
                      <Card
                        style={[styles.recentCard, { backgroundColor: theme.surface }]}
                      >
                        <View style={styles.recentRow}>
                          <View style={styles.productEmojiContainer}>
                            <Text style={styles.templateEmoji}>🛍️</Text>
                          </View>
                          <View style={styles.recentContent}>
                            <Text style={[styles.recentTitle, { color: theme.text }]}>
                              {recent.name}
                            </Text>
                            <Text style={[styles.recentSubtitle, { color: theme.textSecondary }]}>
                              {formatAccessedDate(recent.accessedAt)}
                            </Text>
                            {productMeta && (
                              <Text
                                style={[styles.recentMeta, { color: theme.textSecondary }]}
                                numberOfLines={1}
                              >
                                {productMeta}
                              </Text>
                            )}
                          </View>
                          <Text style={[styles.chevron, { color: theme.textTertiary }]}>›</Text>
                        </View>
                      </Card>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {mealPlanRecents.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Meal Plans
                </Text>
                {mealPlanRecents.map((recent) => (
                  <Pressable key={recent.id} onPress={handleMealPlanPress}>
                    <Card
                      style={[styles.recentCard, { backgroundColor: theme.surface }]}
                    >
                      <View style={styles.recentRow}>
                        <View style={styles.mealPlanBadge}>
                          <Text style={styles.templateEmoji}>📅</Text>
                        </View>
                        <View style={styles.recentContent}>
                          <Text style={[styles.recentTitle, { color: theme.text }]}>
                            {recent.mealName || `${recent.mealType} - ${recent.date}`}
                          </Text>
                          <Text style={[styles.recentSubtitle, { color: theme.textSecondary }]}>
                            {formatAccessedDate(recent.accessedAt)}
                          </Text>
                        </View>
                        <Text style={[styles.chevron, { color: theme.textTertiary }]}>›</Text>
                      </View>
                    </Card>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
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
  sectionsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
  },
  clearButton: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
  },
  recentCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  listIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listIcon: {
    fontSize: 28,
  },
  recentContent: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  recentTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
  },
  recentSubtitle: {
    fontSize: typography.bodySmall,
  },
  recentMeta: {
    fontSize: typography.caption,
  },
  chevron: {
    fontSize: 24,
  },
  templateBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
  },
  templateEmoji: {
    fontSize: 28,
  },
  productEmojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
  },
  mealPlanBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
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
