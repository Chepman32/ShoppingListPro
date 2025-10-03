/**
 * Lists Store
 * Manages shopping lists state using Zustand
 * Based on SDD Section 4.2
 */

import { create } from 'zustand';
import { database, List } from '../database';
import { Q } from '@nozbe/watermelondb';
import { CreateListData } from '../types/database';

interface ListsState {
  lists: List[];
  activeListId: string | null;
  sortBy: 'name' | 'date' | 'custom';
  filterBy: 'all' | 'active' | 'archived';
  loading: boolean;

  // Actions
  fetchLists: () => Promise<void>;
  createList: (data: CreateListData) => Promise<List>;
  updateList: (id: string, updates: Partial<List>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  archiveList: (id: string) => Promise<void>;
  unarchiveList: (id: string) => Promise<void>;
  setActiveList: (id: string | null) => void;
  reorderLists: (fromIndex: number, toIndex: number) => Promise<void>;
  duplicateList: (id: string) => Promise<List>;
  clearCompletedItems: (listId: string) => Promise<void>;
}

export const useListsStore = create<ListsState>((set, get) => ({
  lists: [],
  activeListId: null,
  sortBy: 'custom',
  filterBy: 'active',
  loading: false,

  fetchLists: async () => {
    set({ loading: true });
    try {
      const listsCollection = database.get<List>('lists');
      const lists = await listsCollection
        .query(Q.sortBy('position', Q.asc))
        .fetch();
      set({ lists, loading: false });
    } catch (error) {
      console.error('Error fetching lists:', error);
      set({ loading: false });
    }
  },

  createList: async (data) => {
    const list = await database.write(async () => {
      const listsCollection = database.get<List>('lists');
      const position = get().lists.length;

      return await listsCollection.create((newList) => {
        newList.name = data.name;
        newList.icon = data.icon;
        newList.color = data.color;
        newList.position = position;
        newList.isArchived = false;
        newList.storeLocation = data.storeLocation;
        newList.budget = data.budget;
      });
    });

    await get().fetchLists();
    return list;
  },

  updateList: async (id, updates) => {
    await database.write(async () => {
      const list = await database.get<List>('lists').find(id);
      await list.update((l) => {
        Object.assign(l, updates);
      });
    });
    await get().fetchLists();
  },

  deleteList: async (id) => {
    await database.write(async () => {
      const list = await database.get<List>('lists').find(id);
      const items = await list.items.fetch();

      // Delete all items first
      await Promise.all(items.map((item) => item.markAsDeleted()));

      // Delete the list
      await list.markAsDeleted();
    });

    if (get().activeListId === id) {
      set({ activeListId: null });
    }
    await get().fetchLists();
  },

  archiveList: async (id) => {
    await get().updateList(id, { isArchived: true });
  },

  unarchiveList: async (id) => {
    await get().updateList(id, { isArchived: false });
  },

  setActiveList: (id) => {
    set({ activeListId: id });
  },

  reorderLists: async (fromIndex, toIndex) => {
    const lists = [...get().lists];
    const [movedList] = lists.splice(fromIndex, 1);
    lists.splice(toIndex, 0, movedList);

    await database.write(async () => {
      await Promise.all(
        lists.map((list, index) =>
          list.update((l) => {
            l.position = index;
          })
        )
      );
    });

    await get().fetchLists();
  },

  duplicateList: async (id) => {
    const originalList = await database.get<List>('lists').find(id);
    const items = await originalList.items.fetch();

    const newList = await database.write(async () => {
      const listsCollection = database.get<List>('lists');
      const position = get().lists.length;

      const list = await listsCollection.create((newList) => {
        newList.name = `${originalList.name} (Copy)`;
        newList.icon = originalList.icon;
        newList.color = originalList.color;
        newList.position = position;
        newList.isArchived = false;
        newList.storeLocation = originalList.storeLocation;
        newList.budget = originalList.budget;
      });

      // Duplicate items
      const itemsCollection = database.get('list_items');
      await Promise.all(
        items.map((item, index) =>
          itemsCollection.create((newItem: any) => {
            newItem.listId = list.id;
            newItem.name = item.name;
            newItem.quantity = item.quantity;
            newItem.unit = item.unit;
            newItem.category = item.category;
            newItem.position = index;
            newItem.isChecked = false;
            newItem.notes = item.notes;
            newItem.price = item.price;
          })
        )
      );

      return list;
    });

    await get().fetchLists();
    return newList;
  },

  clearCompletedItems: async (listId) => {
    const list = await database.get<List>('lists').find(listId);
    const items = await list.items.fetch();
    const checkedItems = items.filter((item) => item.isChecked);

    await database.write(async () => {
      await Promise.all(
        checkedItems.map((item) => item.markAsDeleted())
      );
    });
  },
}));
