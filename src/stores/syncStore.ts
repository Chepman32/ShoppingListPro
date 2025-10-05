/**
 * Sync Store
 * Manages cloud synchronization state and operations
 */

import { create } from 'zustand';
import { supabaseService, SyncStatus } from '../services/supabase';

interface SyncState {
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  isAnonymous: boolean;
  syncStatus: SyncStatus;
  autoSyncEnabled: boolean;

  // Auth actions
  signInAnonymously: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  linkToEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;

  // Sync actions
  initializeSync: () => Promise<void>;
  forceSync: () => Promise<void>;
  toggleAutoSync: () => void;
  stopSync: () => void;

  // Internal
  updateAuthState: () => Promise<void>;
  updateSyncStatus: () => void;
}

export const useSyncStore = create<SyncState>((set, get) => ({
  isAuthenticated: false,
  userId: null,
  userEmail: null,
  isAnonymous: false,
  syncStatus: {
    lastSyncTime: null,
    isSyncing: false,
    error: null,
  },
  autoSyncEnabled: true,

  // Auth actions
  signInAnonymously: async () => {
    // Supabase doesn't support anonymous auth by default
    // You would need to implement a custom solution
    throw new Error('Anonymous sign-in not supported with Supabase. Please create an account.');
  },

  signInWithEmail: async (email: string, password: string) => {
    try {
      await supabaseService.signIn(email, password);
      await get().updateAuthState();

      // Auto-initialize sync if enabled and user is authenticated
      if (get().autoSyncEnabled && get().isAuthenticated) {
        await get().initializeSync();
      }
    } catch (error) {
      console.error('Sign in with email failed:', error);
      throw error;
    }
  },

  createAccount: async (email: string, password: string) => {
    try {
      await supabaseService.signUp(email, password);
      await get().updateAuthState();

      // Note: Supabase may require email verification before user is fully authenticated
      // Auto-initialize sync only if enabled and user is authenticated
      if (get().autoSyncEnabled && get().isAuthenticated) {
        await get().initializeSync();
      }
    } catch (error) {
      console.error('Create account failed:', error);
      throw error;
    }
  },

  linkToEmail: async (email: string, password: string) => {
    // Not applicable for Supabase as there's no anonymous auth
    throw new Error('Account linking not supported with Supabase');
  },

  signOut: async () => {
    try {
      get().stopSync();
      await supabaseService.signOut();
      await get().updateAuthState();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  },

  sendPasswordReset: async (email: string) => {
    try {
      await supabaseService.resetPassword(email);
    } catch (error) {
      console.error('Send password reset failed:', error);
      throw error;
    }
  },

  // Sync actions
  initializeSync: async () => {
    try {
      if (!get().isAuthenticated || !get().userId) {
        throw new Error('User must be authenticated to sync');
      }

      // TODO: Implement actual sync initialization
      get().updateSyncStatus();

      // Set up periodic status updates
      const interval = setInterval(() => {
        get().updateSyncStatus();
      }, 5000);

      // Store interval for cleanup
      (get as any)._syncStatusInterval = interval;
    } catch (error) {
      console.error('Initialize sync failed:', error);
      set({
        syncStatus: {
          lastSyncTime: null,
          isSyncing: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  },

  forceSync: async () => {
    try {
      if (!get().isAuthenticated || !get().userId) {
        throw new Error('User must be authenticated to sync');
      }

      // TODO: Implement actual sync logic
      await supabaseService.syncData(get().userId!, {});
      get().updateSyncStatus();
    } catch (error) {
      console.error('Force sync failed:', error);
      set({
        syncStatus: {
          ...get().syncStatus,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  },

  toggleAutoSync: () => {
    set({ autoSyncEnabled: !get().autoSyncEnabled });
  },

  stopSync: () => {
    // Clear status update interval
    if ((get as any)._syncStatusInterval) {
      clearInterval((get as any)._syncStatusInterval);
      (get as any)._syncStatusInterval = null;
    }

    set({
      syncStatus: {
        lastSyncTime: null,
        isSyncing: false,
        error: null,
      },
    });
  },

  // Internal
  updateAuthState: async () => {
    const session = await supabaseService.getSession();
    const user = session?.user ?? null;

    set({
      isAuthenticated: !!user,
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
      isAnonymous: false, // Supabase doesn't support anonymous auth
    });
  },

  updateSyncStatus: () => {
    set({
      syncStatus: supabaseService.getSyncStatus(),
    });
  },
}));

// Set up auth state listener
supabaseService.onAuthStateChange(async () => {
  await useSyncStore.getState().updateAuthState();
});
