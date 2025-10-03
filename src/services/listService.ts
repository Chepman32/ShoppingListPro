/**
 * List Service
 * Business logic for list operations
 */

import { database, List, ListItem } from '../database';
import { Q } from '@nozbe/watermelondb';
import { CreateListData } from '../types/database';

export class ListService {
  /**
   * Get list statistics
   */
  static async getListStats(listId: string) {
    const list = await database.get<List>('lists').find(listId);
    const items = await list.items.fetch();

    const checkedCount = items.filter((i) => i.isChecked).length;
    const totalCount = items.length;
    const totalPrice = items
      .filter((i) => i.price)
      .reduce((sum, i) => sum + (i.price || 0), 0);

    return {
      totalItems: totalCount,
      checkedItems: checkedCount,
      uncheckedItems: totalCount - checkedCount,
      completionPercentage: totalCount > 0 ? (checkedCount / totalCount) * 100 : 0,
      estimatedCost: totalPrice,
    };
  }

  /**
   * Clear completed items from list
   */
  static async clearCompletedItems(listId: string) {
    const list = await database.get<List>('lists').find(listId);
    const items = await list.items.fetch();
    const completedItems = items.filter((i) => i.isChecked);

    await database.write(async () => {
      await Promise.all(
        completedItems.map((item) => item.markAsDeleted())
      );
    });
  }

  /**
   * Get items by category
   */
  static async getItemsByCategory(listId: string) {
    const list = await database.get<List>('lists').find(listId);
    const items = await list.items.fetch();

    const byCategory: Record<string, ListItem[]> = {};

    items.forEach((item) => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = [];
      }
      byCategory[item.category].push(item);
    });

    return byCategory;
  }
}
