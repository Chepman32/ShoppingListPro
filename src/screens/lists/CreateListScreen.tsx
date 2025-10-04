/**
 * Create List Screen
 * Modal for creating new shopping lists
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Input, Button } from '../../components/core';
import { useListsStore, useSettingsStore } from '../../stores';
import { colors, typography, spacing } from '../../theme';

const ICONS = ['🛒', '🍎', '🥕', '🍞', '🥛', '🧺', '📋', '✨'];
const COLORS = [
  colors.primary,
  colors.success,
  colors.error,
  colors.warning,
  '#5856D6',
  '#AF52DE',
  '#FF2D55',
  '#00C7BE',
];

export const CreateListScreen = () => {
  const navigation = useNavigation();
  const createList = useListsStore((state) => state.createList);
  const { defaultListIcon, defaultListColor } = useSettingsStore();

  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(defaultListIcon);
  const [selectedColor, setSelectedColor] = useState(defaultListColor);

  const handleCreate = async () => {
    if (!name.trim()) return;

    await createList({
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButtonContainer}>
          <Text style={styles.closeButton}>✕</Text>
        </Pressable>
        <Text style={styles.title}>New List</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Input
          label="List Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Weekly Groceries"
          autoFocus
        />

        <Text style={styles.sectionTitle}>Choose Icon</Text>
        <View style={styles.iconsGrid}>
          {ICONS.map((icon) => (
            <Pressable
              key={icon}
              onPress={() => setSelectedIcon(icon)}
              style={[
                styles.iconButton,
                selectedIcon === icon && styles.iconButtonSelected,
              ]}
            >
              <Text style={styles.iconText}>{icon}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Choose Color</Text>
        <View style={styles.colorsGrid}>
          {COLORS.map((color) => (
            <Pressable
              key={color}
              onPress={() => setSelectedColor(color)}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColor === color && styles.colorButtonSelected,
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={handleCreate} disabled={!name.trim()} fullWidth>
          Create List
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
  closeButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: 24,
    color: colors.text,
    fontWeight: typography.weightMedium,
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
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  iconText: {
    fontSize: 32,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: colors.text,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
