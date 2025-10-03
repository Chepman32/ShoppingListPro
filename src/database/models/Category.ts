/**
 * Category Model
 * Represents a category for items
 */

import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Category extends Model {
  static table = 'categories';

  @field('name') name!: string;
  @field('icon') icon!: string;
  @field('color') color!: string;
  @field('position') position!: number;
  @field('is_custom') isCustom!: boolean;
}
