/**
 * Settings Store
 * Manages app settings and preferences
 * Based on SDD Section 4.2
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { ThemeMode } from '../theme/themes';

// Initialize MMKV storage
const storage = new MMKV();

// Custom MMKV storage adapter for Zustand
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

export type Language = 'en' | 'ru' | 'sp' | 'de' | 'fr' | 'por' | 'jp' | 'ch' | 'ko' | 'ua';

interface SettingsState {
  // Appearance
  themeMode: ThemeMode;
  language: Language;
  hapticsEnabled: boolean;
  soundEnabled: boolean;

  // Lists
  defaultListIcon: string;
  defaultListColor: string;
  sortCategories: boolean;
  showCompletedItems: boolean;

  // Units
  currency: string;
  units: 'metric' | 'imperial';

  // Onboarding
  hasCompletedOnboarding: boolean;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
  toggleHaptics: () => void;
  toggleSound: () => void;
  updateSettings: (updates: Partial<SettingsState>) => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      themeMode: 'light',
      language: 'en',
      hapticsEnabled: true,
      soundEnabled: false,
      defaultListIcon: '🛒',
      defaultListColor: '#007AFF',
      sortCategories: true,
      showCompletedItems: true,
      currency: 'USD',
      units: 'imperial',
      hasCompletedOnboarding: false,

      setThemeMode: (mode) => {
        set({ themeMode: mode });
      },

      setLanguage: (lang) => {
        set({ language: lang });
      },

      toggleHaptics: () => {
        set((state) => ({ hapticsEnabled: !state.hapticsEnabled }));
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      updateSettings: (updates) => {
        set(updates);
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
