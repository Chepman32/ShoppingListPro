/**
 * Meal Plan Store
 * Manages meal planning data and calendar operations
 */

import { create } from 'zustand';
import { database, MealPlan, Recipe, List } from '../database';
import { Q } from '@nozbe/watermelondb';

export type ViewMode = 'week' | 'month';

export interface AddMealData {
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId?: string;
  customMealName?: string;
  servings: number;
  notes?: string;
  isLeftover?: boolean;
  leftoverFromDate?: Date;
}

interface MealPlanState {
  // State
  mealPlans: MealPlan[];
  recipes: Recipe[];
  viewMode: ViewMode;
  currentWeekStart: Date;
  loading: boolean;

  // Actions
  fetchMealPlans: (startDate: Date, endDate: Date) => Promise<void>;
  fetchRecipes: () => Promise<void>;
  addMealToCalendar: (data: AddMealData) => Promise<MealPlan>;
  updateMeal: (id: string, updates: Partial<AddMealData>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  setCurrentWeekStart: (date: Date) => void;
  navigateWeek: (direction: 'prev' | 'next') => void;
  generateShoppingList: (startDate: Date, endDate: Date, listName: string) => Promise<List>;
  getMealsForDate: (date: Date) => MealPlan[];
}

// Helper to get start of week (Sunday)
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

// Helper to get start of day timestamp
const getStartOfDay = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

// Helper to get end of day timestamp
const getEndOfDay = (date: Date): number => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

export const useMealPlanStore = create<MealPlanState>((set, get) => ({
  // Initial state
  mealPlans: [],
  recipes: [],
  viewMode: 'week',
  currentWeekStart: getStartOfWeek(new Date()),
  loading: false,

  // Fetch meal plans for a date range
  fetchMealPlans: async (startDate: Date, endDate: Date) => {
    set({ loading: true });
    try {
      const mealPlansCollection = database.get<MealPlan>('meal_plans');
      const startTimestamp = getStartOfDay(startDate);
      const endTimestamp = getEndOfDay(endDate);

      const plans = await mealPlansCollection
        .query(
          Q.where('date', Q.gte(startTimestamp)),
          Q.where('date', Q.lte(endTimestamp)),
          Q.sortBy('date', Q.asc)
        )
        .fetch();

      set({ mealPlans: plans, loading: false });
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      set({ loading: false });
    }
  },

  // Fetch all recipes for meal selection
  fetchRecipes: async () => {
    try {
      const recipesCollection = database.get<Recipe>('recipes');
      const recipes = await recipesCollection.query().fetch();
      set({ recipes });
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  },

  // Add a meal to the calendar
  addMealToCalendar: async (data: AddMealData) => {
    try {
      const mealPlansCollection = database.get<MealPlan>('meal_plans');

      // Get existing meals for this date and meal type to determine position
      const existingMeals = await mealPlansCollection
        .query(
          Q.where('date', Q.eq(getStartOfDay(data.date))),
          Q.where('meal_type', Q.eq(data.mealType))
        )
        .fetch();

      const newMeal = await database.write(async () => {
        return await mealPlansCollection.create((meal: any) => {
          meal.date = getStartOfDay(data.date);
          meal.mealType = data.mealType;
          meal.recipeId = data.recipeId || null;
          meal.customMealName = data.customMealName || null;
          meal.notes = data.notes || null;
          meal.servings = data.servings;
          meal.isLeftover = data.isLeftover || false;
          meal.leftoverFromDate = data.leftoverFromDate
            ? getStartOfDay(data.leftoverFromDate)
            : null;
          meal.position = existingMeals.length;
        });
      });

      // Refresh meal plans
      const { currentWeekStart, viewMode } = get();
      const endDate = new Date(currentWeekStart);
      endDate.setDate(endDate.getDate() + (viewMode === 'week' ? 7 : 30));
      await get().fetchMealPlans(currentWeekStart, endDate);

      return newMeal;
    } catch (error) {
      console.error('Error adding meal to calendar:', error);
      throw error;
    }
  },

  // Update an existing meal
  updateMeal: async (id: string, updates: Partial<AddMealData>) => {
    try {
      const mealPlansCollection = database.get<MealPlan>('meal_plans');
      const meal = await mealPlansCollection.find(id);

      await database.write(async () => {
        await meal.update((m: any) => {
          if (updates.date !== undefined) {
            m.date = getStartOfDay(updates.date);
          }
          if (updates.mealType !== undefined) {
            m.mealType = updates.mealType;
          }
          if (updates.recipeId !== undefined) {
            m.recipeId = updates.recipeId || null;
          }
          if (updates.customMealName !== undefined) {
            m.customMealName = updates.customMealName || null;
          }
          if (updates.notes !== undefined) {
            m.notes = updates.notes || null;
          }
          if (updates.servings !== undefined) {
            m.servings = updates.servings;
          }
          if (updates.isLeftover !== undefined) {
            m.isLeftover = updates.isLeftover;
          }
          if (updates.leftoverFromDate !== undefined) {
            m.leftoverFromDate = updates.leftoverFromDate
              ? getStartOfDay(updates.leftoverFromDate)
              : null;
          }
        });
      });

      // Refresh meal plans
      const { currentWeekStart, viewMode } = get();
      const endDate = new Date(currentWeekStart);
      endDate.setDate(endDate.getDate() + (viewMode === 'week' ? 7 : 30));
      await get().fetchMealPlans(currentWeekStart, endDate);
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  },

  // Delete a meal
  deleteMeal: async (id: string) => {
    try {
      const mealPlansCollection = database.get<MealPlan>('meal_plans');
      const meal = await mealPlansCollection.find(id);

      await database.write(async () => {
        await meal.markAsDeleted();
      });

      // Refresh meal plans
      const { currentWeekStart, viewMode } = get();
      const endDate = new Date(currentWeekStart);
      endDate.setDate(endDate.getDate() + (viewMode === 'week' ? 7 : 30));
      await get().fetchMealPlans(currentWeekStart, endDate);
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  },

  // Set view mode
  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode });
  },

  // Set current week start
  setCurrentWeekStart: (date: Date) => {
    set({ currentWeekStart: getStartOfWeek(date) });
  },

  // Navigate to previous/next week
  navigateWeek: (direction: 'prev' | 'next') => {
    const { currentWeekStart } = get();
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    set({ currentWeekStart: newDate });

    // Fetch meal plans for new week
    const endDate = new Date(newDate);
    endDate.setDate(endDate.getDate() + 7);
    get().fetchMealPlans(newDate, endDate);
  },

  // Generate shopping list from meal plan
  generateShoppingList: async (startDate: Date, endDate: Date, listName: string) => {
    try {
      const mealPlansCollection = database.get<MealPlan>('meal_plans');
      const startTimestamp = getStartOfDay(startDate);
      const endTimestamp = getEndOfDay(endDate);

      // Get all meals in the date range
      const meals = await mealPlansCollection
        .query(
          Q.where('date', Q.gte(startTimestamp)),
          Q.where('date', Q.lte(endTimestamp))
        )
        .fetch();

      // Collect all recipe IDs
      const recipeIds = meals
        .filter((m) => m.recipeId)
        .map((m) => m.recipeId!);

      // Fetch all recipes with their ingredients
      const recipesCollection = database.get<Recipe>('recipes');
      const recipes = await recipesCollection
        .query(Q.where('id', Q.oneOf(recipeIds)))
        .fetch();

      // Aggregate ingredients
      const ingredientsMap = new Map<string, {
        name: string;
        quantity: number;
        unit: string;
        category: string;
      }>();

      for (const recipe of recipes) {
        const ingredients = await recipe.ingredients.fetch();
        const meal = meals.find((m) => m.recipeId === recipe.id);
        const servingMultiplier = meal ? meal.servings / recipe.servings : 1;

        for (const ingredient of ingredients) {
          const key = `${ingredient.name}-${ingredient.unit}`;
          const existing = ingredientsMap.get(key);

          if (existing) {
            existing.quantity += ingredient.quantity * servingMultiplier;
          } else {
            ingredientsMap.set(key, {
              name: ingredient.name,
              quantity: ingredient.quantity * servingMultiplier,
              unit: ingredient.unit,
              category: 'Other', // Default category
            });
          }
        }
      }

      // Create new shopping list
      const listsCollection = database.get<List>('lists');
      const listItemsCollection = database.get('list_items');

      const newList = await database.write(async () => {
        // Create list
        const list = await listsCollection.create((l: any) => {
          l.name = listName;
          l.icon = '📅';
          l.color = '#5AC8FA';
          l.isArchived = false;
          l.position = 0;
        });

        // Create list items
        let position = 0;
        for (const ingredient of ingredientsMap.values()) {
          await listItemsCollection.create((item: any) => {
            item.listId = list.id;
            item.name = ingredient.name;
            item.quantity = ingredient.quantity;
            item.unit = ingredient.unit;
            item.category = ingredient.category;
            item.isChecked = false;
            item.position = position++;
          });
        }

        return list;
      });

      return newList;
    } catch (error) {
      console.error('Error generating shopping list:', error);
      throw error;
    }
  },

  // Get meals for a specific date
  getMealsForDate: (date: Date) => {
    const { mealPlans } = get();
    const targetTimestamp = getStartOfDay(date);
    return mealPlans.filter((m) => m.date === targetTimestamp);
  },
}));
