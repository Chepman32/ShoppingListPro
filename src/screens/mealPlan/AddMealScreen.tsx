/**
 * Add Meal Screen
 * Modal for adding a meal to the calendar
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card, Button } from '../../components/core';
import { useMealPlanStore } from '../../stores/mealPlanStore';
import { useTheme } from '../../ThemeContext';
import { spacing, typography, borderRadius } from '../../theme';

type MealSource = 'recipe' | 'custom';

export const AddMealScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { recipes, fetchRecipes, addMealToCalendar } = useMealPlanStore();

  // Get params from navigation
  const params = route.params as { date: string; mealType: string } | undefined;
  const date = params?.date ? new Date(params.date) : new Date();
  const mealType = (params?.mealType || 'dinner') as 'breakfast' | 'lunch' | 'dinner' | 'snack';

  const [mealSource, setMealSource] = useState<MealSource>('custom');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [customMealName, setCustomMealName] = useState('');
  const [servings, setServings] = useState('2');
  const [notes, setNotes] = useState('');
  const [isLeftover, setIsLeftover] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId);

  const handleSave = async () => {
    // Validation
    if (mealSource === 'recipe' && !selectedRecipeId) {
      Alert.alert('Error', 'Please select a recipe');
      return;
    }

    if (mealSource === 'custom' && !customMealName.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }

    const servingsNum = parseInt(servings, 10);
    if (isNaN(servingsNum) || servingsNum < 1) {
      Alert.alert('Error', 'Please enter a valid number of servings');
      return;
    }

    setSaving(true);
    try {
      await addMealToCalendar({
        date,
        mealType,
        recipeId: mealSource === 'recipe' ? selectedRecipeId || undefined : undefined,
        customMealName: mealSource === 'custom' ? customMealName.trim() : undefined,
        servings: servingsNum,
        notes: notes.trim() || undefined,
        isLeftover,
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add meal. Please try again.');
      console.error('Error adding meal:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = () => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelButton, { color: theme.primary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Add Meal</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text
            style={[
              styles.saveButton,
              { color: theme.primary },
              saving && { opacity: 0.5 },
            ]}
          >
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Date and Meal Type */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Date & Time</Text>
          <Text style={[styles.value, { color: theme.text }]}>{formatDate()}</Text>
          <Text style={[styles.mealTypeLabel, { color: theme.text }]}>
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </Text>
        </Card>

        {/* Meal Source Toggle */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Meal Source</Text>
          <View style={styles.sourceToggle}>
            <TouchableOpacity
              style={[
                styles.sourceButton,
                mealSource === 'recipe' && { backgroundColor: theme.primary },
                { borderColor: theme.border },
              ]}
              onPress={() => setMealSource('recipe')}
            >
              <Text
                style={[
                  styles.sourceButtonText,
                  { color: mealSource === 'recipe' ? '#FFFFFF' : theme.text },
                ]}
              >
                From Recipe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sourceButton,
                mealSource === 'custom' && { backgroundColor: theme.primary },
                { borderColor: theme.border },
              ]}
              onPress={() => setMealSource('custom')}
            >
              <Text
                style={[
                  styles.sourceButtonText,
                  { color: mealSource === 'custom' ? '#FFFFFF' : theme.text },
                ]}
              >
                Custom Meal
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recipe Selection */}
        {mealSource === 'recipe' && (
          <Card style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Recipe</Text>
            {recipes.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No recipes available. Create a recipe first or use a custom meal.
              </Text>
            ) : (
              <ScrollView style={styles.recipeList}>
                {recipes.map((recipe) => (
                  <TouchableOpacity
                    key={recipe.id}
                    style={[
                      styles.recipeItem,
                      selectedRecipeId === recipe.id && {
                        backgroundColor: theme.primaryLight,
                      },
                      { borderColor: theme.border },
                    ]}
                    onPress={() => setSelectedRecipeId(recipe.id)}
                  >
                    <View style={styles.recipeInfo}>
                      <Text style={[styles.recipeName, { color: theme.text }]}>
                        {recipe.name}
                      </Text>
                      {recipe.description && (
                        <Text
                          style={[styles.recipeDescription, { color: theme.textSecondary }]}
                          numberOfLines={1}
                        >
                          {recipe.description}
                        </Text>
                      )}
                    </View>
                    {selectedRecipeId === recipe.id && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </Card>
        )}

        {/* Custom Meal Name */}
        {mealSource === 'custom' && (
          <Card style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Meal Name</Text>
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border },
              ]}
              placeholder="e.g., Chicken Salad"
              placeholderTextColor={theme.textTertiary}
              value={customMealName}
              onChangeText={setCustomMealName}
            />
          </Card>
        )}

        {/* Servings */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Servings</Text>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Number of servings"
            placeholderTextColor={theme.textTertiary}
            value={servings}
            onChangeText={setServings}
            keyboardType="number-pad"
          />
          {mealSource === 'recipe' && selectedRecipe && (
            <Text style={[styles.hint, { color: theme.textSecondary }]}>
              Recipe default: {selectedRecipe.servings} servings
            </Text>
          )}
        </Card>

        {/* Notes */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes (Optional)</Text>
          <TextInput
            style={[
              styles.textArea,
              { color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Add any notes about this meal..."
            placeholderTextColor={theme.textTertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </Card>

        {/* Leftover Toggle */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Mark as Leftover ♻️
              </Text>
              <Text style={[styles.hint, { color: theme.textSecondary }]}>
                This meal is a leftover from a previous meal
              </Text>
            </View>
            <Switch
              value={isLeftover}
              onValueChange={setIsLeftover}
              trackColor={{ false: theme.border, true: theme.primaryLight }}
              thumbColor={isLeftover ? theme.primary : theme.textTertiary}
            />
          </View>
        </Card>
      </ScrollView>
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
  saveButton: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.bodySmall,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
  },
  mealTypeLabel: {
    fontSize: typography.body,
    marginTop: spacing.xs,
    fontWeight: typography.weightMedium,
  },
  sectionTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.sm,
  },
  sourceToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sourceButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  sourceButtonText: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  recipeList: {
    maxHeight: 300,
  },
  recipeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    marginBottom: spacing.xs,
  },
  recipeDescription: {
    fontSize: typography.bodySmall,
  },
  checkmark: {
    fontSize: 20,
    color: '#34C759',
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.body,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.body,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    marginRight: spacing.md,
  },
  emptyText: {
    fontSize: typography.body,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
