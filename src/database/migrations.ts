/**
 * WatermelonDB Migrations
 * Database schema migrations
 */

import { schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    // Migration from version 1 to 2: Add meal_plans table
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'meal_plans',
          columns: [
            { name: 'date', type: 'number', isIndexed: true },
            { name: 'meal_type', type: 'string', isIndexed: true },
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
    },
  ],
});
