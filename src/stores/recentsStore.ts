/**
 * Recents Store
 * Tracks recently accessed items across the app
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RecentEntry } from '../types/recents';

const MAX_RECENTS = 500;

interface RecentsState {
  recents: RecentEntry[];
  addRecent: (item: RecentEntry) => void;
  clearRecents: () => void;
  removeRecent: (type: RecentEntry['type'], id: string) => void;
}

export const useRecentsStore = create<RecentsState>()(
  persist(
    (set) => ({
      recents: [],

      addRecent: (item: RecentEntry) =>
        set((state) => {
          // Remove existing entry if it exists
          const filtered = state.recents.filter(
            (r) => !(r.type === item.type && r.id === item.id)
          );

          // Add new entry at the beginning
          const updated = [item, ...filtered];

          // Keep only the last MAX_RECENTS items
          return {
            recents: updated.slice(0, MAX_RECENTS),
          };
        }),

      removeRecent: (type: RecentEntry['type'], id: string) =>
        set((state) => ({
          recents: state.recents.filter((r) => !(r.type === type && r.id === id)),
        })),

      clearRecents: () =>
        set({
          recents: [],
        }),
    }),
    {
      name: 'recents-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
