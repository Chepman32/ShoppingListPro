/**
 * Create Template Screen
 * Modal for creating new shopping list templates
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Input, Button } from '../../components/core';
import { useTemplatesStore } from '../../stores';
import { colors, typography, spacing } from '../../theme';
import { TemplateItem } from '../../types/database';

export const CreateTemplateScreen = () => {
  const navigation = useNavigation();
  const createTemplate = useTemplatesStore((state) => state.createTemplate);

  const [name, setName] = useState('');
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const newItem: TemplateItem = {
      name: newItemName.trim(),
      quantity: 1,
      unit: '',
      category: '',
    };

    setItems([...items, newItem]);
    setNewItemName('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updates: Partial<TemplateItem>) => {
    setItems(
      items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const handleCreate = async () => {
    if (!name.trim() || items.length === 0) return;

    await createTemplate({
      name: name.trim(),
      items,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.closeButton}>✕</Text>
          </Pressable>
          <Text style={styles.title}>New Template</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Template Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Taco Night"
            autoFocus
          />

          <Text style={styles.sectionTitle}>Items</Text>

          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                {(item.quantity || item.unit) && (
                  <Text style={styles.itemMeta}>
                    {item.quantity} {item.unit}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveItem(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder="Add item..."
              placeholderTextColor={colors.textTertiary}
              onSubmitEditing={handleAddItem}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={handleAddItem}
              style={styles.addItemButton}
              disabled={!newItemName.trim()}
            >
              <Text style={styles.addItemButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {items.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No items yet. Add items to your template above.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            onPress={handleCreate}
            disabled={!name.trim() || items.length === 0}
            fullWidth
          >
            Create Template
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  closeButton: {
    fontSize: 28,
    color: colors.textSecondary,
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
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  itemContent: {
    flex: 1,
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
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    color: colors.error,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  addItemInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    fontSize: typography.body,
    color: colors.text,
  },
  addItemButton: {
    paddingHorizontal: spacing.lg,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemButtonText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
    color: colors.background,
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
