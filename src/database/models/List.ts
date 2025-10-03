/**
 * List Model
 * Represents a shopping list
 */

import { Model, Query } from '@nozbe/watermelondb';
import { field, date, readonly, children, writer } from '@nozbe/watermelondb/decorators';
import ListItem from './ListItem';

export default class List extends Model {
  static table = 'lists';
  static associations = {
    list_items: { type: 'has_many' as const, foreignKey: 'list_id' },
  };

  @field('name') name!: string;
  @field('icon') icon!: string;
  @field('color') color!: string;
  @field('is_archived') isArchived!: boolean;
  @field('position') position!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('completed_at') completedAt?: Date;
  @field('store_location') storeLocation?: string;
  @field('budget') budget?: number;

  @children('list_items') items!: Query<ListItem>;

  @writer async archive() {
    await this.update((list) => {
      list.isArchived = true;
    });
  }

  @writer async unarchive() {
    await this.update((list) => {
      list.isArchived = false;
    });
  }

  @writer async markCompleted() {
    await this.update((list) => {
      list.completedAt = new Date();
    });
  }
}
