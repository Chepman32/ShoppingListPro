/**
 * Supabase Service
 * Manages authentication and data synchronization with Supabase
 */

import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://xencwvwthtfvuhdyqaqv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlbmN3dnd0aHRmdnVoZHlxYXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NzE2NzgsImV4cCI6MjA3NTI0NzY3OH0.mHtSdqNDG1taN1N8daaccMH8yzzvIvDulCT_EMCdxDo';

export interface SyncStatus {
  lastSyncTime: number | null;
  isSyncing: boolean;
  error: string | null;
}

class SupabaseService {
  private client: SupabaseClient | null = null;
  private authStateChangeCallbacks: Array<(user: User | null) => void> = [];
  private syncStatus: SyncStatus = {
    lastSyncTime: null,
    isSyncing: false,
    error: null,
  };

  private initializeClient() {
    if (this.client) return this.client;

    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        fetch: (...args) => fetch(...args),
      },
    });

    // Listen for auth state changes
    this.client.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      this.authStateChangeCallbacks.forEach(callback => callback(user));
    });

    return this.client;
  }

  private getClient(): SupabaseClient {
    return this.initializeClient();
  }

  // Auth methods
  async signUp(email: string, password: string) {
    const client = this.getClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const client = this.getClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const client = this.getClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string) {
    const client = this.getClient();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: 'shoppinglistpro://auth/callback',
    });

    if (error) throw error;
  }

  getCurrentUser(): User | null {
    const client = this.getClient();
    return client.auth.getUser().then(({ data }) => data.user).catch(() => null) as any;
  }

  async getSession(): Promise<Session | null> {
    const client = this.getClient();
    const { data } = await client.auth.getSession();
    return data.session;
  }

  isSignedIn(): boolean {
    const client = this.getClient();
    // This is synchronous approximation - for actual state use getSession
    return client.auth.getUser().then(({ data }) => !!data.user).catch(() => false) as any;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    this.authStateChangeCallbacks.push(callback);
  }

  // Sync methods
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  async syncData(userId: string, data: any) {
    this.syncStatus.isSyncing = true;
    this.syncStatus.error = null;

    try {
      const client = this.getClient();
      // TODO: Implement actual sync logic based on your data schema
      // Example: await client.from('user_data').upsert({ user_id: userId, data });

      this.syncStatus.lastSyncTime = Date.now();
    } catch (error) {
      this.syncStatus.error = error instanceof Error ? error.message : 'Sync failed';
      throw error;
    } finally {
      this.syncStatus.isSyncing = false;
    }
  }

  async fetchData(userId: string) {
    try {
      const client = this.getClient();
      // TODO: Implement actual fetch logic based on your data schema
      // Example: const { data } = await client.from('user_data').select('*').eq('user_id', userId);
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService();
