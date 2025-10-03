/**
 * RecipeIngredient Model
 * Represents an ingredient in a recipe
 */

import { Model, Relation } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import Recipe from './Recipe';
import PantryItem from './PantryItem';

export default class RecipeIngredient extends Model {
  static table = 'recipe_ingredients';
  static associations = {
    recipes: { type: 'belongs_to' as const, key: 'recipe_id' },
    pantry_items: { type: 'belongs_to' as const, key: 'pantry_item_id' },
  };

  @field('recipe_id') recipeId!: string;
  @field('pantry_item_id') pantryItemId?: string;
  @field('name') name!: string;
  @field('quantity') quantity!: number;
  @field('unit') unit!: string;
  @field('notes') notes?: string;
  @field('position') position!: number;

  @relation('recipes', 'recipe_id') recipe!: Relation<Recipe>;
  @relation('pantry_items', 'pantry_item_id') pantryItem?: Relation<PantryItem>;
}
