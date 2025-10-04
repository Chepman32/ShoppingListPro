/**
 * Meal Planner Screen
 * Calendar view for planning meals
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../../components/core';
import { useMealPlanStore } from '../../stores/mealPlanStore';
import { useTheme } from '../../ThemeContext';
import { spacing, typography, borderRadius } from '../../theme';
import { MealPlan } from '../../database';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const MEAL_TYPE_ICONS = {
  breakfast: '☀️',
  lunch: '🌤️',
  dinner: '🌙',
  snack: '🍿',
};

const MEAL_TYPE_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MealPlannerScreen = () => {
  const navigation = useNavigation();
  const { theme, themeMode } = useTheme();
  const {
    mealPlans,
    currentWeekStart,
    fetchMealPlans,
    navigateWeek,
    getMealsForDate,
  } = useMealPlanStore();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [showAddMealModal, setShowAddMealModal] = useState(false);

  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  useEffect(() => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 7);
    fetchMealPlans(currentWeekStart, endDate);
  }, [currentWeekStart, fetchMealPlans]);

  const handleAddMeal = (date: Date, mealType: MealType) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    (navigation as any).navigate('AddMeal', {
      date: date.toISOString(),
      mealType,
    });
  };

  const handleGenerateList = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 7);
    (navigation as any).navigate('GenerateShoppingList', {
      startDate: currentWeekStart.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  const formatDateHeader = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);

    const startMonth = currentWeekStart.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const year = currentWeekStart.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${year}`;
    }
    return `${startMonth} - ${endMonth} ${year}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.primary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Meal Planner</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Week Navigation */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity
          onPress={() => navigateWeek('prev')}
          style={styles.navButton}
        >
          <Text style={[styles.navButtonText, { color: theme.primary }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.weekTitle, { color: theme.text }]}>
          {formatDateHeader()}
        </Text>

        <TouchableOpacity
          onPress={() => navigateWeek('next')}
          style={styles.navButton}
        >
          <Text style={[styles.navButtonText, { color: theme.primary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      <View style={styles.dayHeaders}>
        {weekDates.map((date, index) => (
          <View key={index} style={styles.dayHeader}>
            <Text style={[styles.dayName, { color: theme.textSecondary }]}>
              {DAYS_OF_WEEK[index]}
            </Text>
            <View
              style={[
                styles.dateCircle,
                isToday(date) && { backgroundColor: theme.primary },
              ]}
            >
              <Text
                style={[
                  styles.dateNumber,
                  { color: isToday(date) ? '#FFFFFF' : theme.text },
                ]}
              >
                {date.getDate()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <ScrollView style={styles.calendar}>
        {/* Breakfast Row */}
        <MealRow
          mealType="breakfast"
          weekDates={weekDates}
          getMealsForDate={getMealsForDate}
          onAddMeal={handleAddMeal}
          theme={theme}
        />

        {/* Lunch Row */}
        <MealRow
          mealType="lunch"
          weekDates={weekDates}
          getMealsForDate={getMealsForDate}
          onAddMeal={handleAddMeal}
          theme={theme}
        />

        {/* Dinner Row */}
        <MealRow
          mealType="dinner"
          weekDates={weekDates}
          getMealsForDate={getMealsForDate}
          onAddMeal={handleAddMeal}
          theme={theme}
        />

        {/* Snack Row */}
        <MealRow
          mealType="snack"
          weekDates={weekDates}
          getMealsForDate={getMealsForDate}
          onAddMeal={handleAddMeal}
          theme={theme}
        />
      </ScrollView>

      {/* Generate Shopping List Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.generateButton, { backgroundColor: theme.primary }]}
          onPress={handleGenerateList}
        >
          <Text style={styles.generateButtonText}>🛒 Generate Shopping List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

interface MealRowProps {
  mealType: MealType;
  weekDates: Date[];
  getMealsForDate: (date: Date) => MealPlan[];
  onAddMeal: (date: Date, mealType: MealType) => void;
  theme: any;
}

const MealRow: React.FC<MealRowProps> = ({
  mealType,
  weekDates,
  getMealsForDate,
  onAddMeal,
  theme,
}) => {
  return (
    <View style={styles.mealRow}>
      {/* Meal Type Label */}
      <View style={styles.mealTypeLabel}>
        <Text style={styles.mealTypeIcon}>{MEAL_TYPE_ICONS[mealType]}</Text>
        <Text style={[styles.mealTypeName, { color: theme.text }]}>
          {MEAL_TYPE_LABELS[mealType]}
        </Text>
      </View>

      {/* Meal Cells */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealCells}>
        {weekDates.map((date, index) => {
          const meals = getMealsForDate(date).filter((m) => m.mealType === mealType);
          return (
            <MealCell
              key={index}
              date={date}
              mealType={mealType}
              meals={meals}
              onAdd={() => onAddMeal(date, mealType)}
              theme={theme}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

interface MealCellProps {
  date: Date;
  mealType: MealType;
  meals: MealPlan[];
  onAdd: () => void;
  theme: any;
}

const MealCell: React.FC<MealCellProps> = ({ date, mealType, meals, onAdd, theme }) => {
  return (
    <View style={[styles.mealCell, { borderColor: theme.border }]}>
      {meals.length === 0 ? (
        <TouchableOpacity onPress={onAdd} style={styles.addMealButton}>
          <Text style={[styles.addMealIcon, { color: theme.textTertiary }]}>+</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.mealItems}>
          {meals.map((meal) => (
            <View
              key={meal.id}
              style={[styles.mealItem, { backgroundColor: theme.surface }]}
            >
              <Text
                style={[styles.mealName, { color: theme.text }]}
                numberOfLines={2}
              >
                {meal.customMealName || 'Recipe'}
              </Text>
              {meal.isLeftover && (
                <Text style={styles.leftoverBadge}>♻️</Text>
              )}
            </View>
          ))}
          {meals.length < 2 && (
            <TouchableOpacity onPress={onAdd} style={styles.addMoreButton}>
              <Text style={[styles.addMoreText, { color: theme.primary }]}>+ Add</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    fontSize: 18,
    fontWeight: typography.weightSemibold,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
  },
  navButtonText: {
    fontSize: 32,
    fontWeight: typography.weightBold,
  },
  weekTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightSemibold,
  },
  dayHeaders: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'space-around',
  },
  dayHeader: {
    alignItems: 'center',
    width: 50,
  },
  dayName: {
    fontSize: typography.bodySmall,
    marginBottom: spacing.xs,
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNumber: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  calendar: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  mealRow: {
    marginBottom: spacing.lg,
  },
  mealTypeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  mealTypeIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  mealTypeName: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
  },
  mealCells: {
    flexDirection: 'row',
  },
  mealCell: {
    width: 120,
    minHeight: 80,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  addMealButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMealIcon: {
    fontSize: 32,
  },
  mealItems: {
    gap: spacing.xs,
  },
  mealItem: {
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: typography.bodySmall,
    flex: 1,
  },
  leftoverBadge: {
    fontSize: 12,
  },
  addMoreButton: {
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  addMoreText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.weightMedium,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  generateButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: typography.h4,
    fontWeight: typography.weightBold,
    color: '#FFFFFF',
  },
});
