/**
 * Cloud Sync Screen
 * Manage cloud synchronization and account
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../../components/core';
import { typography, spacing } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { useSyncStore } from '../../stores';

export const CloudSyncScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const {
    isAuthenticated,
    userId,
    userEmail,
    isAnonymous,
    syncStatus,
    autoSyncEnabled,
    signInAnonymously,
    signInWithEmail,
    createAccount,
    linkToEmail,
    signOut,
    sendPasswordReset,
    initializeSync,
    forceSync,
    toggleAutoSync,
  } = useSyncStore();

  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmail(email, password);
      setShowSignIn(false);
      setEmail('');
      setPassword('');
      Alert.alert('Success', 'Signed in successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await createAccount(email, password);
      setShowCreateAccount(false);
      setEmail('');
      setPassword('');
      Alert.alert(
        'Account Created',
        'Your account has been created! If email confirmation is enabled, please check your inbox to verify your email address.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordReset(email);
      Alert.alert('Success', 'Password reset email sent! Check your inbox.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure? Your local data will remain but won\'t sync until you sign in again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              Alert.alert('Success', 'Signed out successfully');
            } catch (error) {
              Alert.alert('Error', 'Sign out failed');
            }
          },
        },
      ]
    );
  };

  const handleForceSync = async () => {
    try {
      setLoading(true);
      await forceSync();
      Alert.alert('Success', 'Data synced successfully!');
    } catch (error) {
      Alert.alert('Error', 'Sync failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatLastSyncTime = () => {
    if (!syncStatus.lastSyncTime) return 'Never';

    const diff = Date.now() - syncStatus.lastSyncTime;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Cloud Sync</Text>

        {!isAuthenticated ? (
          // Not signed in
          <>
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>
                Enable Cloud Backup
              </Text>
              <Text style={[styles.cardDescription, { color: theme.textTertiary }]}>
                Sync your lists, templates, and settings across all your devices. Your data is
                encrypted and stored securely with Supabase.
              </Text>
            </Card>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => setShowCreateAccount(true)}
            >
              <Text style={[styles.buttonText, { color: theme.surface }]}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.outlineButton, { borderColor: theme.primary }]}
              onPress={() => setShowSignIn(true)}
            >
              <Text style={[styles.buttonText, { color: theme.primary }]}>Sign In</Text>
            </TouchableOpacity>

            {/* Sign In Form */}
            {showSignIn && (
              <Card style={styles.card}>
                <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Sign In</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.textSecondary }]}
                  placeholder="Email"
                  placeholderTextColor={theme.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.textSecondary }]}
                  placeholder="Password"
                  placeholderTextColor={theme.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary, flex: 1, marginRight: spacing.sm }]}
                    onPress={handleEmailSignIn}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={theme.surface} />
                    ) : (
                      <Text style={[styles.buttonText, { color: theme.surface }]}>Sign In</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.outlineButton, { borderColor: theme.textTertiary, flex: 1 }]}
                    onPress={() => setShowSignIn(false)}
                  >
                    <Text style={[styles.buttonText, { color: theme.textTertiary }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handlePasswordReset}>
                  <Text style={[styles.linkText, { color: theme.primary }]}>Forgot Password?</Text>
                </TouchableOpacity>
              </Card>
            )}

            {/* Create Account Form */}
            {showCreateAccount && (
              <Card style={styles.card}>
                <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Create Account</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.textSecondary }]}
                  placeholder="Email"
                  placeholderTextColor={theme.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.textSecondary }]}
                  placeholder="Password (min 6 characters)"
                  placeholderTextColor={theme.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary, flex: 1, marginRight: spacing.sm }]}
                    onPress={handleCreateAccount}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={theme.surface} />
                    ) : (
                      <Text style={[styles.buttonText, { color: theme.surface }]}>Create</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.outlineButton, { borderColor: theme.textTertiary, flex: 1 }]}
                    onPress={() => setShowCreateAccount(false)}
                  >
                    <Text style={[styles.buttonText, { color: theme.textTertiary }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            )}
          </>
        ) : (
          // Signed in
          <>
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Account</Text>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>Status:</Text>
                <Text style={[styles.infoValue, { color: theme.textSecondary }]}>
                  {isAnonymous ? 'Anonymous' : 'Signed In'}
                </Text>
              </View>
              {userEmail && (
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>Email:</Text>
                  <Text style={[styles.infoValue, { color: theme.textSecondary }]}>{userEmail}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>User ID:</Text>
                <Text style={[styles.infoValue, { color: theme.textSecondary }]} numberOfLines={1}>
                  {userId?.substring(0, 16)}...
                </Text>
              </View>
            </Card>

            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Sync Status</Text>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>Last Sync:</Text>
                <Text style={[styles.infoValue, { color: theme.textSecondary }]}>
                  {formatLastSyncTime()}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>Auto Sync:</Text>
                <Switch
                  value={autoSyncEnabled}
                  onValueChange={toggleAutoSync}
                  trackColor={{ false: theme.borderLight, true: theme.primary }}
                  thumbColor={autoSyncEnabled ? theme.primary : theme.border}
                />
              </View>
              {syncStatus.isSyncing && (
                <View style={styles.syncingRow}>
                  <ActivityIndicator size="small" color={theme.primary} />
                  <Text style={[styles.syncingText, { color: theme.textTertiary }]}>Syncing...</Text>
                </View>
              )}
            </Card>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleForceSync}
              disabled={loading || syncStatus.isSyncing}
            >
              {loading ? (
                <ActivityIndicator color={theme.surface} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.surface }]}>Sync Now</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.outlineButton, { borderColor: theme.error }]}
              onPress={handleSignOut}
            >
              <Text style={[styles.buttonText, { color: theme.error }]}>Sign Out</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.weightBold,
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  button: {
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    minHeight: 48,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  input: {
    padding: spacing.md,
    borderRadius: 8,
    fontSize: typography.body,
    marginBottom: spacing.sm,
  },
  linkText: {
    fontSize: typography.bodySmall,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.body,
  },
  infoValue: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    flex: 1,
    textAlign: 'right',
  },
  syncingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  syncingText: {
    fontSize: typography.bodySmall,
    marginLeft: spacing.sm,
  },
});
