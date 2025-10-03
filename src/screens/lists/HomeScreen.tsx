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
import { Button, Card } from '../../components/core';
import { useListsStore } from '../../stores';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { List } from '../../database';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { lists, fetchLists, deleteList, archiveList } = useListsStore();

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ListFlow</Text>
        <Pressable onPress={() => navigation.navigate('Settings' as never)}>
          <Text style={styles.settingsIcon}>⚙️</Text>
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
          title="+ New List"
          emoji="🆕"
          onPress={handleCreateList}
        />
        <QuickActionCard
          title="Shopping Mode"
          emoji="🛒"
          onPress={() => {}}
          disabled={activeLists.length === 0}
        />
        <QuickActionCard
          title="Pantry"
          emoji="🏪"
          onPress={() => navigation.navigate('Pantry' as never)}
          premium
        />
        <QuickActionCard
          title="Recipes"
          emoji="📖"
          onPress={() => navigation.navigate('Recipes' as never)}
          premium
        />
      </ScrollView>

      {/* Lists Section */}
      <View style={styles.listsSection}>
        <Text style={styles.sectionTitle}>
          Your Lists ({activeLists.length})
        </Text>

        {activeLists.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyText}>No lists yet</Text>
            <Text style={styles.emptySubtext}>Tap + to create your first list</Text>
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
      <Pressable style={styles.fab} onPress={handleCreateList}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
};

const QuickActionCard: React.FC<{
  title: string;
  emoji: string;
  onPress: () => void;
  disabled?: boolean;
  premium?: boolean;
}> = ({ title, emoji, onPress, disabled, premium }) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Card style={[styles.quickActionCard, disabled && styles.quickActionDisabled]}>
        <Text style={styles.quickActionEmoji}>{emoji}</Text>
        <Text style={styles.quickActionTitle}>{title}</Text>
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
  const [showActions, setShowActions] = useState(false);

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
              <Text style={styles.listName}>{list.name}</Text>
              <Text style={styles.listMeta}>
                {/* TODO: Show item count */}
                0 items
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>

          {showActions && (
            <View style={styles.actions}>
              <Button variant="outline" size="small" onPress={onArchive}>
                Archive
              </Button>
              <Button variant="outline" size="small" onPress={onDelete}>
                Delete
              </Button>
              <Button variant="ghost" size="small" onPress={() => setShowActions(false)}>
                Cancel
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.text,
  },
  settingsIcon: {
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
    color: colors.text,
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
    color: colors.text,
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
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.body,
    color: colors.textSecondary,
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
    color: colors.text,
    marginBottom: spacing.xs,
  },
  listMeta: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 32,
    color: colors.textTertiary,
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
    backgroundColor: colors.primary,
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
