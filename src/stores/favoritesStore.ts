/**
 * Favorites Store
 * Persists favorite lists, templates, and products
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import type { FavoriteEntry, FavoriteItemType } from '../types/favorites';

const storage = new MMKV({ id: 'favorites-storage' });

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

interface FavoritesState {
  favorites: FavoriteEntry[];
  addFavorite: (favorite: FavoriteEntry) => void;
  removeFavorite: (type: FavoriteItemType, id: string) => void;
  toggleFavorite: (favorite: FavoriteEntry) => void;
  isFavorite: (type: FavoriteItemType, id: string) => boolean;
  clearFavorites: () => void;
}

const hydrateFavorite = (favorite: FavoriteEntry): FavoriteEntry => ({
  ...favorite,
  favoritedAt: favorite.favoritedAt || new Date().toISOString(),
});

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (favorite) => {
        const entry = hydrateFavorite(favorite);

        set((state) => {
          const existingIndex = state.favorites.findIndex(
            (item) => item.type === entry.type && item.id === entry.id
          );

          if (existingIndex !== -1) {
            const updated = [...state.favorites];
            updated[existingIndex] = entry;
            return { favorites: updated };
          }

          return { favorites: [entry, ...state.favorites] };
        });
      },

      removeFavorite: (type, id) => {
        set((state) => ({
          favorites: state.favorites.filter(
            (item) => !(item.type === type && item.id === id)
          ),
        }));
      },

      toggleFavorite: (favorite) => {
        const exists = get().isFavorite(favorite.type, favorite.id);
        if (exists) {
          get().removeFavorite(favorite.type, favorite.id);
        } else {
          get().addFavorite(favorite);
        }
      },

      isFavorite: (type, id) =>
        get().favorites.some((item) => item.type === type && item.id === id),

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
