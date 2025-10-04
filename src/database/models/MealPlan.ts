/**
 * MealPlan Model
 * Represents a planned meal for a specific date and meal type
 */

import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import Recipe from './Recipe';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export default class MealPlan extends Model {
  static table = 'meal_plans';
  static associations = {
    recipes: { type: 'belongs_to' as const, key: 'recipe_id' },
  };

  @field('date') date!: number; // Unix timestamp
  @field('meal_type') mealType!: MealType;
  @field('recipe_id') recipeId?: string;
  @field('custom_meal_name') customMealName?: string;
  @field('notes') notes?: string;
  @field('servings') servings!: number;
  @field('is_leftover') isLeftover!: boolean;
  @field('leftover_from_date') leftoverFromDate?: number;
  @field('position') position!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('recipes', 'recipe_id') recipe?: Relation<Recipe>;

  get displayName(): string {
    return this.customMealName || 'Unnamed Meal';
  }

  get isCustomMeal(): boolean {
    return !this.recipeId && !!this.customMealName;
  }
}
