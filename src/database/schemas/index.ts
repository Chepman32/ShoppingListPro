/**
 * WatermelonDB Schema
 * Defines all tables and columns according to SDD Section 4.1
 */

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 2,
  tables: [
    // Lists Table
    tableSchema({
      name: 'lists',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'is_archived', type: 'boolean', isIndexed: true },
        { name: 'position', type: 'number', isIndexed: true },
        { name: 'created_at', type: 'number', isIndexed: true },
        { name: 'updated_at', type: 'number', isIndexed: true },
        { name: 'completed_at', type: 'number', isOptional: true },
        { name: 'store_location', type: 'string', isOptional: true },
        { name: 'budget', type: 'number', isOptional: true },
      ],
    }),

    // ListItems Table
    tableSchema({
      name: 'list_items',
      columns: [
        { name: 'list_id', type: 'string', isIndexed: true },
        { name: 'pantry_item_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'category', type: 'string', isIndexed: true },
        { name: 'is_checked', type: 'boolean', isIndexed: true },
        { name: 'position', type: 'number', isIndexed: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'price', type: 'number', isOptional: true },
        { name: 'image_uri', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'checked_at', type: 'number', isOptional: true },
      ],
    }),

    // PantryItems Table (Premium Feature)
    tableSchema({
      name: 'pantry_items',
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'category', type: 'string', isIndexed: true },
        { name: 'quantity', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'location', type: 'string' }, // fridge, pantry, freezer
        { name: 'expiry_date', type: 'number', isOptional: true, isIndexed: true },
        { name: 'purchase_date', type: 'number' },
        { name: 'low_stock_threshold', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'image_uri', type: 'string', isOptional: true },
        { name: 'barcode', type: 'string', isOptional: true, isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // Categories Table
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'icon', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'position', type: 'number', isIndexed: true },
        { name: 'is_custom', type: 'boolean' },
      ],
    }),

    // Recipes Table (Premium Feature)
    tableSchema({
      name: 'recipes',
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'servings', type: 'number' },
        { name: 'prep_time', type: 'number' },
        { name: 'cook_time', type: 'number' },
        { name: 'image_uri', type: 'string', isOptional: true },
        { name: 'instructions', type: 'string' },
        { name: 'is_favorite', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // RecipeIngredients Table
    tableSchema({
      name: 'recipe_ingredients',
      columns: [
        { name: 'recipe_id', type: 'string', isIndexed: true },
        { name: 'pantry_item_id', type: 'string', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'position', type: 'number' },
      ],
    }),

    // MealPlans Table (Meal Planning Feature)
    tableSchema({
      name: 'meal_plans',
      columns: [
        { name: 'date', type: 'number', isIndexed: true }, // Unix timestamp
        { name: 'meal_type', type: 'string', isIndexed: true }, // breakfast, lunch, dinner, snack
        { name: 'recipe_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'custom_meal_name', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'servings', type: 'number' },
        { name: 'is_leftover', type: 'boolean' },
        { name: 'leftover_from_date', type: 'number', isOptional: true },
        { name: 'position', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
