/**
 * Template Detail Screen
 * View template details and add to shopping list
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTemplatesStore, useListsStore } from '../../stores';
import { Button, Card } from '../../components/core';
import { colors, typography, spacing } from '../../theme';
import { RootStackParamList } from '../../types';
import { database } from '../../database';
import ListItem from '../../database/models/ListItem';

type TemplateDetailRouteProp = RouteProp<RootStackParamList, 'TemplateDetail'>;

export const TemplateDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<TemplateDetailRouteProp>();
  const { templateId } = route.params;

  const { getTemplate, deleteTemplate } = useTemplatesStore();
  const { lists, fetchLists } = useListsStore();

  const [showListPicker, setShowListPicker] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const template = getTemplate(templateId);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  if (!template) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Template not found</Text>
          <Button onPress={() => navigation.goBack()}>Go Back</Button>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${template.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTemplate(templateId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleAddToList = async (listId: string) => {
    setIsAdding(true);
    try {
      await database.write(async () => {
        const listItemsCollection = database.get<ListItem>('list_items');
        const list = await database.get('lists').find(listId);
        const existingItems = await list.items.fetch();
        const position = existingItems.length;

        // Add all template items to the list
        await Promise.all(
          template.items.map((item, index) =>
            listItemsCollection.create((newItem: any) => {
              newItem.listId = listId;
              newItem.name = item.name;
              newItem.quantity = item.quantity || 1;
              newItem.unit = item.unit || '';
              newItem.category = item.category || '';
              newItem.position = position + index;
              newItem.isChecked = false;
              newItem.notes = item.notes || '';
            })
          )
        );
      });

      setShowListPicker(false);
      Alert.alert(
        'Success',
        `${template.items.length} items added to list`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding items to list:', error);
      Alert.alert('Error', 'Failed to add items to list');
    } finally {
      setIsAdding(false);
    }
  };

  const activeLists = lists.filter((l) => !l.isArchived);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{template.name}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {template.isPredefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Built-in Template</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          Items ({template.items.length})
        </Text>

        {template.items.map((item, index) => (
          <Card key={index} style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            {(item.quantity || item.unit || item.category) && (
              <Text style={styles.itemMeta}>
                {item.quantity && item.unit
                  ? `${item.quantity} ${item.unit}`
                  : item.quantity
                  ? `${item.quantity}`
                  : ''}
                {item.category && ` • ${item.category}`}
              </Text>
            )}
            {item.notes && (
              <Text style={styles.itemNotes}>{item.notes}</Text>
            )}
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {!template.isPredefined && (
          <Button variant="outline" onPress={handleDelete}>
            Delete Template
          </Button>
        )}
        <Button onPress={() => setShowListPicker(true)} fullWidth>
          Add to Shopping List
        </Button>
      </View>

      {/* List Picker Modal */}
      <Modal
        visible={showListPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowListPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select List</Text>
              <TouchableOpacity onPress={() => setShowListPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {activeLists.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    No lists available. Create a list first.
                  </Text>
                </View>
              ) : (
                activeLists.map((list) => (
                  <Pressable
                    key={list.id}
                    onPress={() => handleAddToList(list.id)}
                    disabled={isAdding}
                  >
                    <Card style={styles.listOption}>
                      <View
                        style={[
                          styles.listIcon,
                          { backgroundColor: list.color },
                        ]}
                      >
                        <Text style={styles.listIconText}>{list.icon}</Text>
                      </View>
                      <Text style={styles.listName}>{list.name}</Text>
                    </Card>
                  </Pressable>
                ))
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                variant="outline"
                onPress={() => setShowListPicker(false)}
                fullWidth
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    fontSize: 36,
    color: colors.primary,
    fontWeight: typography.weightBold,
  },
  title: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  badgeText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.weightMedium,
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  itemCard: {
    marginBottom: spacing.md,
  },
  itemName: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  itemMeta: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  itemNotes: {
    fontSize: typography.bodySmall,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.h3,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  modalClose: {
    fontSize: 28,
    color: colors.textSecondary,
  },
  modalScroll: {
    padding: spacing.lg,
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  listIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  listIconText: {
    fontSize: 24,
  },
  listName: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.text,
  },
});
