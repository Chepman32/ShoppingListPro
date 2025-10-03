/**
 * Settings Store
 * Manages app settings and preferences
 * Based on SDD Section 4.2
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

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

interface SettingsState {
  // Appearance
  theme: 'light' | 'dark' | 'auto';
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

  // Premium
  isPremium: boolean;
  premiumExpiry: number | null;

  // Onboarding
  hasCompletedOnboarding: boolean;

  // Actions
  updateSettings: (updates: Partial<SettingsState>) => void;
  setPremium: (isPremium: boolean, expiry?: Date) => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      theme: 'auto',
      hapticsEnabled: true,
      soundEnabled: false,
      defaultListIcon: '🛒',
      defaultListColor: '#007AFF',
      sortCategories: true,
      showCompletedItems: true,
      currency: 'USD',
      units: 'imperial',
      isPremium: false,
      premiumExpiry: null,
      hasCompletedOnboarding: false,

      updateSettings: (updates) => {
        set(updates);
      },

      setPremium: (isPremium, expiry) => {
        set({
          isPremium,
          premiumExpiry: expiry ? expiry.getTime() : null,
        });
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
