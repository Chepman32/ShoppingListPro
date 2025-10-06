/**
 * Home Screen (Lists Overview)
 * Shows all shopping lists with animations
 * Based on SDD Section 6.3
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  FadeInDown,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../../components/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useListsStore } from '../../stores';
import { typography, spacing, borderRadius } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { List } from '../../database';

export const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { lists, fetchLists, deleteList, archiveList } = useListsStore();
  const { theme } = useTheme();

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleCreateList = () => {
    navigation.navigate('CreateList' as never);
  };

  const handleListPress = (list: List) => {
    navigation.navigate('ListDetail' as never, { listId: list.id } as never);
  };

  const activeLists = lists.filter((l) => !l.isArchived);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('home.title')}</Text>
        <Pressable onPress={() => navigation.navigate('Recents' as never)}>
          <Text style={styles.recentsIcon}>🕒</Text>
        </Pressable>
      </View>

      {/* Quick Actions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickActions}
        contentContainerStyle={styles.quickActionsContent}
      >
        <QuickActionCard
          title={t('home.quickActions.recents')}
          emoji="🕒"
          onPress={() => navigation.navigate('Recents' as never)}
        />
        <QuickActionCard
          title={t('home.quickActions.mealPlan')}
          emoji="📅"
          onPress={() => navigation.navigate('MealPlannerFromHome' as never)}
        />
        <QuickActionCard
          title={t('home.quickActions.cloudSync')}
          emoji="☁️"
          onPress={() => navigation.navigate('CloudSync' as never)}
        />
        <QuickActionCard
          title={t('home.quickActions.pantry')}
          emoji="🏪"
          onPress={() => navigation.navigate('Pantry' as never)}
          premium
        />
        <QuickActionCard
          title={t('home.quickActions.templates')}
          emoji="📋"
          onPress={() => navigation.navigate('Templates' as never)}
        />
      </ScrollView>

      {/* Lists Section */}
      <View style={styles.listsSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('home.yourLists')} ({activeLists.length})
        </Text>

        {activeLists.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={[styles.emptyText, { color: theme.text }]}>{t('home.noLists')}</Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>{t('home.createFirst')}</Text>
          </View>
        ) : (
          <FlashList
            data={activeLists}
            renderItem={({ item, index }) => (
              <ListCard
                list={item}
                index={index}
                onPress={() => handleListPress(item)}
                onDelete={() => deleteList(item.id)}
                onArchive={() => archiveList(item.id)}
              />
            )}
            estimatedItemSize={120}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <Pressable style={[styles.fab, { backgroundColor: theme.primary }]} onPress={handleCreateList}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
      </View>
    </SafeAreaView>
  );
};

const QuickActionCard: React.FC<{
  title: string;
  emoji: string;
  onPress: () => void;
  disabled?: boolean;
  premium?: boolean;
}> = ({ title, emoji, onPress, disabled, premium }) => {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Card style={[styles.quickActionCard, disabled && styles.quickActionDisabled]}>
        <Text style={styles.quickActionEmoji}>{emoji}</Text>
        <Text style={[styles.quickActionTitle, { color: theme.textSecondary }]}>{title}</Text>
        {premium && <Text style={styles.premiumBadge}>⭐</Text>}
      </Card>
    </Pressable>
  );
};

const ListCard: React.FC<{
  list: List;
  index: number;
  onPress: () => void;
  onDelete: () => void;
  onArchive: () => void;
}> = ({ list, index, onPress, onDelete, onArchive }) => {
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)}
      exiting={FadeOutLeft}
      layout={Layout.springify()}
    >
      <Pressable
        onPress={onPress}
        onLongPress={() => setShowActions(true)}
      >
        <Card style={styles.listCard}>
          <View style={styles.listCardContent}>
            <View style={[styles.iconCircle, { backgroundColor: list.color }]}>
              <Text style={styles.iconText}>{list.icon}</Text>
            </View>
            <View style={styles.listInfo}>
              <Text style={[styles.listName, { color: theme.textSecondary }]}>{list.name}</Text>
              <Text style={[styles.listMeta, { color: theme.textTertiary }]}>
                {/* TODO: Show item count */}
                0 {t('home.items')}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: theme.textTertiary }]}>›</Text>
          </View>

          {showActions && (
            <View style={styles.actions}>
              <Button variant="outline" size="small" onPress={onArchive}>
                {t('home.actions.archive')}
              </Button>
              <Button variant="outline" size="small" onPress={onDelete}>
                {t('home.actions.delete')}
              </Button>
              <Button variant="ghost" size="small" onPress={() => setShowActions(false)}>
                {t('home.actions.cancel')}
              </Button>
            </View>
          )}
        </Card>
      </Pressable>
    </Animated.View>
  );
};

const shadowStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
  },
  recentsIcon: {
    fontSize: 28,
  },
  quickActions: {
    maxHeight: 120,
  },
  quickActionsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  quickActionCard: {
    width: 160,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionDisabled: {
    opacity: 0.5,
  },
  quickActionEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  quickActionTitle: {
    fontSize: typography.bodySmall,
    fontWeight: typography.weightMedium,
  },
  premiumBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    fontSize: 16,
  },
  listsSection: {
    flex: 1,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.xxl * 2,
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
  },
  listCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  listCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 28,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.xs,
  },
  listMeta: {
    fontSize: typography.bodySmall,
  },
  chevron: {
    fontSize: 32,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadowStyle,
  },
  fabText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: typography.weightBold,
  },
  shadow: shadowStyle,
});
