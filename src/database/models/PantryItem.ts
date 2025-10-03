/**
 * PantryItem Model (Premium Feature)
 * Represents an item in the pantry
 */

import { Model, Query } from '@nozbe/watermelondb';
import { field, date, readonly, children, writer } from '@nozbe/watermelondb/decorators';
import ListItem from './ListItem';

export default class PantryItem extends Model {
  static table = 'pantry_items';
  static associations = {
    list_items: { type: 'has_many' as const, foreignKey: 'pantry_item_id' },
  };

  @field('name') name!: string;
  @field('category') category!: string;
  @field('quantity') quantity!: number;
  @field('unit') unit!: string;
  @field('location') location!: string; // 'fridge' | 'pantry' | 'freezer'
  @date('expiry_date') expiryDate?: Date;
  @readonly @date('purchase_date') purchaseDate!: Date;
  @field('low_stock_threshold') lowStockThreshold!: number;
  @field('notes') notes?: string;
  @field('image_uri') imageUri?: string;
  @field('barcode') barcode?: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('list_items') listItems!: Query<ListItem>;

  @writer async consume(amount: number) {
    await this.update((item) => {
      item.quantity = Math.max(0, item.quantity - amount);
    });
  }

  @writer async replenish(amount: number) {
    await this.update((item) => {
      item.quantity += amount;
    });
  }

  get isLowStock(): boolean {
    return this.quantity <= this.lowStockThreshold;
  }

  get isExpiring(): boolean {
    if (!this.expiryDate) return false;
    const daysUntilExpiry = Math.floor(
      (this.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
  }

  get isExpired(): boolean {
    if (!this.expiryDate) return false;
    return this.expiryDate.getTime() < Date.now();
  }
}
