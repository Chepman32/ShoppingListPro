/**
 * Generate Shopping List Screen
 * Creates a shopping list from meal plan
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card, Button } from '../../components/core';
import { useMealPlanStore } from '../../stores/mealPlanStore';
import { useTheme } from '../../ThemeContext';
import { spacing, typography, borderRadius } from '../../theme';

export const GenerateShoppingListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { generateShoppingList } = useMealPlanStore();

  const params = route.params as { startDate: string; endDate: string } | undefined;
  const startDate = params?.startDate ? new Date(params.startDate) : new Date();
  const endDate = params?.endDate ? new Date(params.endDate) : new Date();

  const [listName, setListName] = useState('Meal Plan Shopping List');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!listName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    setGenerating(true);
    try {
      const newList = await generateShoppingList(startDate, endDate, listName.trim());

      Alert.alert(
        'Success',
        'Shopping list created successfully!',
        [
          {
            text: 'View List',
            onPress: () => {
              (navigation as any).navigate('Lists');
              (navigation as any).navigate('ListDetail', { listId: newList.id });
            },
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate shopping list. Please try again.');
      console.error('Error generating shopping list:', error);
    } finally {
      setGenerating(false);
    }
  };

  const formatDateRange = () => {
    const startStr = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const endStr = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${startStr} - ${endStr}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelButton, { color: theme.primary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Generate List</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        {/* Info Card */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.emoji, { textAlign: 'center' }]}>🛒</Text>
          <Text style={[styles.infoTitle, { color: theme.text }]}>
            Create Shopping List from Meal Plan
          </Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            This will create a shopping list with all ingredients needed for your planned meals.
          </Text>
        </Card>

        {/* Date Range */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Date Range</Text>
          <Text style={[styles.value, { color: theme.text }]}>{formatDateRange()}</Text>
        </Card>

        {/* List Name Input */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>List Name</Text>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Enter list name"
            placeholderTextColor={theme.textTertiary}
            value={listName}
            onChangeText={setListName}
          />
        </Card>

        {/* Generate Button */}
        <View style={styles.buttonContainer}>
          {generating ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            <Button
              variant="primary"
              onPress={handleGenerate}
              style={{ backgroundColor: theme.primary }}
            >
              Generate Shopping List
            </Button>
          )}
        </View>

        {/* Info Note */}
        <Card style={[styles.noteCard, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.noteIcon, { textAlign: 'center' }]}>💡</Text>
          <Text style={[styles.noteText, { color: theme.text }]}>
            The list will include ingredients from all recipes in your meal plan for the selected week.
            Quantities will be adjusted based on the number of servings.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cancelButton: {
    fontSize: typography.body,
  },
  title: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  label: {
    fontSize: typography.bodySmall,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.body,
    marginTop: spacing.sm,
  },
  buttonContainer: {
    marginVertical: spacing.lg,
  },
  noteCard: {
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  noteIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  noteText: {
    fontSize: typography.bodySmall,
    textAlign: 'center',
    lineHeight: 20,
  },
});
