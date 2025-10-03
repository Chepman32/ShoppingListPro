/**
 * Recipe Model (Premium Feature)
 * Represents a recipe
 */

import { Model, Query } from '@nozbe/watermelondb';
import { field, date, readonly, children, writer } from '@nozbe/watermelondb/decorators';
import RecipeIngredient from './RecipeIngredient';

export default class Recipe extends Model {
  static table = 'recipes';
  static associations = {
    recipe_ingredients: { type: 'has_many' as const, foreignKey: 'recipe_id' },
  };

  @field('name') name!: string;
  @field('description') description?: string;
  @field('servings') servings!: number;
  @field('prep_time') prepTime!: number;
  @field('cook_time') cookTime!: number;
  @field('image_uri') imageUri?: string;
  @field('instructions') instructions!: string;
  @field('is_favorite') isFavorite!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('recipe_ingredients') ingredients!: Query<RecipeIngredient>;

  @writer async toggleFavorite() {
    await this.update((recipe) => {
      recipe.isFavorite = !recipe.isFavorite;
    });
  }

  get totalTime(): number {
    return this.prepTime + this.cookTime;
  }
}
