/**
 * WatermelonDB Database Configuration
 * Initializes the database with schema and models
 */

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schemas';
import {
  List,
  ListItem,
  PantryItem,
  Category,
  Recipe,
  RecipeIngredient,
  MealPlan,
} from './models';

// Create the adapter
const adapter = new SQLiteAdapter({
  schema,
  // dbName: 'ListFlow', // Optional: specify database name
  // migrations, // TODO: Add migrations when schema changes
});

// Create the database
export const database = new Database({
  adapter,
  modelClasses: [
    List,
    ListItem,
    PantryItem,
    Category,
    Recipe,
    RecipeIngredient,
    MealPlan,
  ],
});

/**
 * Initialize default categories
 */
export const initializeDefaultCategories = async () => {
  const categoriesCollection = database.get<Category>('categories');
  const existingCategories = await categoriesCollection.query().fetch();

  if (existingCategories.length > 0) {
    return; // Categories already initialized
  }

  const defaultCategories = [
    { name: 'Produce', icon: '🥬', color: '#34C759', position: 0 },
    { name: 'Dairy', icon: '🥛', color: '#5AC8FA', position: 1 },
    { name: 'Meat', icon: '🥩', color: '#FF3B30', position: 2 },
    { name: 'Bakery', icon: '🍞', color: '#FF9500', position: 3 },
    { name: 'Frozen', icon: '❄️', color: '#5856D6', position: 4 },
    { name: 'Pantry', icon: '🥫', color: '#AF52DE', position: 5 },
    { name: 'Beverages', icon: '🥤', color: '#00C7BE', position: 6 },
    { name: 'Snacks', icon: '🍿', color: '#FF2D55', position: 7 },
    { name: 'Personal Care', icon: '🧴', color: '#FF6482', position: 8 },
    { name: 'Household', icon: '🧹', color: '#8E8E93', position: 9 },
    { name: 'Baby', icon: '👶', color: '#FFD60A', position: 10 },
    { name: 'Pet', icon: '🐾', color: '#BF5AF2', position: 11 },
    { name: 'Pharmacy', icon: '💊', color: '#32ADE6', position: 12 },
    { name: 'Other', icon: '📦', color: '#98989D', position: 13 },
  ];

  await database.write(async () => {
    await Promise.all(
      defaultCategories.map((category) =>
        categoriesCollection.create((newCategory) => {
          newCategory.name = category.name;
          newCategory.icon = category.icon;
          newCategory.color = category.color;
          newCategory.position = category.position;
          newCategory.isCustom = false;
        })
      )
    );
  });
};

// Export models for use in other files
export * from './models';
