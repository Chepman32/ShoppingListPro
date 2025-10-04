/**
 * Favorites Screen
 * Display favorite items and lists
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
import { Card } from '../../components/core';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFavoritesStore } from '../../stores';
import type {
  FavoriteListEntry,
  FavoriteTemplateEntry,
  FavoriteProductEntry,
} from '../../types/favorites';

const formatFavoritedDate = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString();
};

const buildProductMeta = (favorite: FavoriteProductEntry) => {
  const parts: string[] = [];
  const { quantity, unit } = favorite.product;

  if (quantity && unit) {
    parts.push(`${quantity} ${unit}`);
  } else if (quantity) {
    parts.push(quantity);
  }

  if (favorite.sourceListName) {
    parts.push(favorite.sourceListName);
  }

  return parts.join(' • ');
};

export const FavoritesScreen = () => {
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation();
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const { listFavorites, templateFavorites, productFavorites } = useMemo(() => {
    const lists: FavoriteListEntry[] = [];
    const templates: FavoriteTemplateEntry[] = [];
    const products: FavoriteProductEntry[] = [];

    favorites.forEach((favorite) => {
      if (favorite.type === 'list') {
        lists.push(favorite);
      } else if (favorite.type === 'template') {
        templates.push(favorite);
      } else {
        products.push(favorite);
      }
    });

    return { listFavorites: lists, templateFavorites: templates, productFavorites: products };
  }, [favorites]);

  const hasFavorites =
    listFavorites.length > 0 || templateFavorites.length > 0 || productFavorites.length > 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {!hasFavorites ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>⭐</Text>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              {t('favorites.noFavorites')}
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              {t('favorites.addFavoritesHint')}
            </Text>
          </View>
        ) : (
          <View style={styles.sectionsContainer}>
            {listFavorites.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t('favorites.listsSection')}
                </Text>
                {listFavorites.map((favorite) => {
                  const formattedDate = formatFavoritedDate(favorite.favoritedAt);

                  return (
                    <Card
                      key={favorite.id}
                      style={[styles.favoriteCard, { backgroundColor: theme.surface }]}
                    >
                      <View style={styles.favoriteRow}>
                        <View
                          style={[
                            styles.listIconContainer,
                            { backgroundColor: favorite.color ?? colors.primary + '20' },
                          ]}
                        >
                          <Text style={styles.listIcon}>{favorite.icon ?? '🛒'}</Text>
                        </View>
                        <View style={styles.favoriteContent}>
                          <Text style={[styles.favoriteTitle, { color: theme.text }]}>
                            {favorite.name}
                          </Text>
                          {formattedDate ? (
                            <Text style={[styles.favoriteSubtitle, { color: theme.textSecondary }]}>
                              {t('favorites.favoritedOn', {
                                defaultValue: 'Favorited on {{date}}',
                                date: formattedDate,
                              })}
                            </Text>
                          ) : null}
                        </View>
                        <Pressable
                          onPress={() => removeFavorite('list', favorite.id)}
                          style={styles.favoriteActionButton}
                          accessibilityRole="button"
                          accessibilityLabel={t('favorites.removeFavorite')}
                        >
                          <Text style={[styles.favoriteActionIcon, { color: colors.primary }]}>
                            ★
                          </Text>
                        </Pressable>
                      </View>
                    </Card>
                  );
                })}
              </View>
            )}

            {templateFavorites.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t('favorites.templatesSection')}
                </Text>
                {templateFavorites.map((favorite) => (
                  <Card
                    key={favorite.id}
                    style={[styles.favoriteCard, { backgroundColor: theme.surface }]}
                  >
                    <View style={styles.favoriteRow}>
                      <View style={styles.templateBadge}>
                        <Text style={styles.templateEmoji}>📋</Text>
                      </View>
                      <View style={styles.favoriteContent}>
                        <Text style={[styles.favoriteTitle, { color: theme.text }]}>
                          {favorite.name}
                        </Text>
                        <Text style={[styles.favoriteSubtitle, { color: theme.textSecondary }]}>
                          {favorite.isPredefined
                            ? t('favorites.builtInTemplate', { defaultValue: 'Built-in template' })
                            : t('favorites.customTemplate', { defaultValue: 'Custom template' })}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => removeFavorite('template', favorite.id)}
                        style={styles.favoriteActionButton}
                        accessibilityRole="button"
                        accessibilityLabel={t('favorites.removeFavorite')}
                      >
                        <Text style={[styles.favoriteActionIcon, { color: colors.primary }]}>
                          ★
                        </Text>
                      </Pressable>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            {productFavorites.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t('favorites.productsSection')}
                </Text>
                {productFavorites.map((favorite) => {
                  const productMeta = buildProductMeta(favorite);

                  return (
                    <Card
                      key={favorite.id}
                      style={[styles.favoriteCard, { backgroundColor: theme.surface }]}
                    >
                      <View style={styles.favoriteRow}>
                        <View style={styles.productEmojiContainer}>
                          <Text style={styles.templateEmoji}>🛍️</Text>
                        </View>
                        <View style={styles.favoriteContent}>
                          <Text style={[styles.favoriteTitle, { color: theme.text }]}>
                            {favorite.name}
                          </Text>
                          {productMeta ? (
                            <Text
                              style={[styles.favoriteSubtitle, { color: theme.textSecondary }]}
                              numberOfLines={1}
                            >
                              {productMeta}
                            </Text>
                          ) : null}
                          {favorite.product.description ? (
                            <Text
                              style={[styles.favoriteMeta, { color: theme.textSecondary }]}
                              numberOfLines={2}
                            >
                              {favorite.product.description}
                            </Text>
                          ) : null}
                        </View>
                        <Pressable
                          onPress={() => removeFavorite('product', favorite.id)}
                          style={styles.favoriteActionButton}
                          accessibilityRole="button"
                          accessibilityLabel={t('favorites.removeFavorite')}
                        >
                          <Text style={[styles.favoriteActionIcon, { color: colors.primary }]}>
                            ★
                          </Text>
                        </Pressable>
                      </View>
                    </Card>
                  );
                })}
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
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
  },
  favoriteCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  favoriteRow: {
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
  favoriteContent: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  favoriteTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
  },
  favoriteSubtitle: {
    fontSize: typography.bodySmall,
  },
  favoriteMeta: {
    fontSize: typography.caption,
  },
  favoriteActionButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  favoriteActionIcon: {
    fontSize: typography.h4,
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
