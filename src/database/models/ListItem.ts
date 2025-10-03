/**
 * ListItem Model
 * Represents an item in a shopping list
 */

import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation, writer } from '@nozbe/watermelondb/decorators';
import List from './List';
import PantryItem from './PantryItem';

export default class ListItem extends Model {
  static table = 'list_items';
  static associations = {
    lists: { type: 'belongs_to' as const, key: 'list_id' },
    pantry_items: { type: 'belongs_to' as const, key: 'pantry_item_id' },
  };

  @field('list_id') listId!: string;
  @field('pantry_item_id') pantryItemId?: string;
  @field('name') name!: string;
  @field('quantity') quantity!: number;
  @field('unit') unit!: string;
  @field('category') category!: string;
  @field('is_checked') isChecked!: boolean;
  @field('position') position!: number;
  @field('notes') notes?: string;
  @field('price') price?: number;
  @field('image_uri') imageUri?: string;
  @readonly @date('created_at') createdAt!: Date;
  @date('checked_at') checkedAt?: Date;

  @relation('lists', 'list_id') list!: Relation<List>;
  @relation('pantry_items', 'pantry_item_id') pantryItem?: Relation<PantryItem>;

  @writer async toggle() {
    await this.update((item) => {
      item.isChecked = !item.isChecked;
      item.checkedAt = item.isChecked ? new Date() : undefined;
    });
  }

  @writer async check() {
    await this.update((item) => {
      item.isChecked = true;
      item.checkedAt = new Date();
    });
  }

  @writer async uncheck() {
    await this.update((item) => {
      item.isChecked = false;
      item.checkedAt = undefined;
    });
  }
}
