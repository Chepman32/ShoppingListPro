/**
 * Suggestions Store
 * Manages recent items and suggestion sorting
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { Suggestions } from '../Suggestions';

const storage = new MMKV({
  id: 'suggestions-storage',
});

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

interface SuggestionsState {
  recentItems: string[]; // Store recently added item names

  // Add an item to recent items
  addRecentItem: (itemName: string) => void;

  // Get filtered and sorted suggestions based on input
  getSuggestions: (input: string, limit?: number) => string[];

  // Clear recent items
  clearRecentItems: () => void;
}

const MAX_RECENT_ITEMS = 50;

export const useSuggestionsStore = create<SuggestionsState>()(
  persist(
    (set, get) => ({
      recentItems: [],

      addRecentItem: (itemName: string) => {
        const normalized = itemName.trim();
        if (!normalized) return;

        set((state) => {
          // Remove if already exists (to move to front)
          const filtered = state.recentItems.filter(
            (item) => item.toLowerCase() !== normalized.toLowerCase()
          );

          // Add to front
          const updated = [normalized, ...filtered];

          // Keep only MAX_RECENT_ITEMS
          return {
            recentItems: updated.slice(0, MAX_RECENT_ITEMS),
          };
        });
      },

      getSuggestions: (input: string, limit = 10) => {
        const { recentItems } = get();
        const normalized = input.trim().toLowerCase();

        if (!normalized) {
          // No input - show recent items first, then alphabetical
          const recentSuggestions = recentItems.slice(0, limit);

          if (recentSuggestions.length >= limit) {
            return recentSuggestions;
          }

          // Fill with alphabetically sorted suggestions
          const remainingSlots = limit - recentSuggestions.length;
          const recentSet = new Set(
            recentItems.map((item) => item.toLowerCase())
          );

          const alphabetical = [...Suggestions]
            .filter((item) => !recentSet.has(item.toLowerCase()))
            .sort((a, b) => a.localeCompare(b))
            .slice(0, remainingSlots);

          return [...recentSuggestions, ...alphabetical];
        }

        // Filter suggestions based on input
        const filteredRecent = recentItems.filter((item) =>
          item.toLowerCase().includes(normalized)
        );

        const recentSet = new Set(
          recentItems.map((item) => item.toLowerCase())
        );

        const filteredSuggestions = Suggestions.filter(
          (item) =>
            item.toLowerCase().includes(normalized) &&
            !recentSet.has(item.toLowerCase())
        ).sort((a, b) => a.localeCompare(b));

        // Combine: recent matches first, then alphabetical matches
        const combined = [...filteredRecent, ...filteredSuggestions];

        return combined.slice(0, limit);
      },

      clearRecentItems: () => {
        set({ recentItems: [] });
      },
    }),
    {
      name: 'suggestions-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
