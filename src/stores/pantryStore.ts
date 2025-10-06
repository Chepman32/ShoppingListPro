/**
 * Pantry Store (Premium Feature)
 * Manages pantry items state
 * Based on SDD Section 4.2
 */

import { create } from 'zustand';
import { database, PantryItem } from '../database';
import { Q } from '@nozbe/watermelondb';
import { CreatePantryItemData } from '../types/database';

interface PantryState {
  items: PantryItem[];
  lowStockItems: PantryItem[];
  expiringItems: PantryItem[];
  loading: boolean;

  // Actions
  fetchItems: () => Promise<void>;
  addItem: (data: CreatePantryItemData) => Promise<PantryItem>;
  updateItem: (id: string, updates: Partial<PantryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  consumeItem: (id: string, quantity: number) => Promise<void>;
  replenishItem: (id: string, quantity: number) => Promise<void>;
  checkExpiring: () => Promise<void>;
  checkLowStock: () => Promise<void>;
}

export const usePantryStore = create<PantryState>((set, get) => ({
  items: [],
  lowStockItems: [],
  expiringItems: [],
  loading: false,

  fetchItems: async () => {
    set({ loading: true });
    try {
      const pantryCollection = database.get<PantryItem>('pantry_items');
      const items = await pantryCollection.query().fetch();
      set({ items, loading: false });

      // Update low stock and expiring items
      await get().checkLowStock();
      await get().checkExpiring();
    } catch (error) {
      console.error('Error fetching pantry items:', error);
      set({ loading: false });
    }
  },

  addItem: async (data) => {
    try {
      console.log('PantryStore addItem called with:', data);
      const item = await database.write(async () => {
        const pantryCollection = database.get<PantryItem>('pantry_items');
        console.log('Creating pantry item...');
        return await pantryCollection.create((newItem) => {
          newItem.name = data.name;
          newItem.category = data.category;
          newItem.quantity = data.quantity;
          newItem.unit = data.unit;
          newItem.location = data.location;
          if (data.expiryDate) {
            newItem.expiryDate = data.expiryDate;
          }
          newItem.lowStockThreshold = data.lowStockThreshold || 1;
          if (data.notes) {
            newItem.notes = data.notes;
          }
          if (data.barcode) {
            newItem.barcode = data.barcode;
          }
        });
      });

      console.log('Pantry item created successfully:', item.id);
      await get().fetchItems();
      return item;
    } catch (error) {
      console.error('Error in pantryStore addItem:', error);
      throw error;
    }
  },

  updateItem: async (id, updates) => {
    await database.write(async () => {
      const item = await database.get<PantryItem>('pantry_items').find(id);
      await item.update((i) => {
        Object.assign(i, updates);
      });
    });
    await get().fetchItems();
  },

  deleteItem: async (id) => {
    await database.write(async () => {
      const item = await database.get<PantryItem>('pantry_items').find(id);
      await item.markAsDeleted();
    });
    await get().fetchItems();
  },

  consumeItem: async (id, quantity) => {
    await database.write(async () => {
      const item = await database.get<PantryItem>('pantry_items').find(id);
      await item.consume(quantity);
    });
    await get().fetchItems();
  },

  replenishItem: async (id, quantity) => {
    await database.write(async () => {
      const item = await database.get<PantryItem>('pantry_items').find(id);
      await item.replenish(quantity);
    });
    await get().fetchItems();
  },

  checkExpiring: async () => {
    const items = get().items;
    const expiringItems = items.filter((item) => item.isExpiring);
    set({ expiringItems });
  },

  checkLowStock: async () => {
    const items = get().items;
    const lowStockItems = items.filter((item) => item.isLowStock);
    set({ lowStockItems });
  },
}));
