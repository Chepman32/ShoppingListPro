/**
 * useListItems Hook
 * Manages list items with WatermelonDB observables
 */

import { useEffect, useState } from 'react';
import { database, List, ListItem } from '../database';
import { Q } from '@nozbe/watermelondb';

export const useListItems = (listId: string) => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listId) return;

    const fetchItems = async () => {
      const list = await database.get<List>('lists').find(listId);
      const listItems = await list.items
        .extend(Q.sortBy('position', Q.asc))
        .fetch();
      setItems(listItems);
      setLoading(false);
    };

    fetchItems();

    // Subscribe to changes
    const subscription = database
      .get<ListItem>('list_items')
      .query(Q.where('list_id', listId))
      .observe()
      .subscribe((items) => {
        setItems(items);
      });

    return () => subscription.unsubscribe();
  }, [listId]);

  const addItem = async (data: {
    name: string;
    quantity?: number;
    unit?: string;
    category?: string;
  }) => {
    await database.write(async () => {
      const itemsCollection = database.get<ListItem>('list_items');
      await itemsCollection.create((item) => {
        item.listId = listId;
        item.name = data.name;
        item.quantity = data.quantity || 1;
        item.unit = data.unit || 'unit';
        item.category = data.category || 'other';
        item.position = items.length;
        item.isChecked = false;
      });
    });
  };

  const toggleItem = async (itemId: string) => {
    await database.write(async () => {
      const item = await database.get<ListItem>('list_items').find(itemId);
      await item.toggle();
    });
  };

  const deleteItem = async (itemId: string) => {
    await database.write(async () => {
      const item = await database.get<ListItem>('list_items').find(itemId);
      await item.markAsDeleted();
    });
  };

  return {
    items,
    loading,
    uncheckedItems: items.filter((i) => !i.isChecked),
    checkedItems: items.filter((i) => i.isChecked),
    addItem,
    toggleItem,
    deleteItem,
  };
};
