/**
 * App Navigator
 * Main navigation configuration
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/lists/HomeScreen';
import { ListDetailScreen } from '../screens/lists/ListDetailScreen';
import { CreateListScreen } from '../screens/lists/CreateListScreen';
import { ShoppingModeScreen } from '../screens/shopping/ShoppingModeScreen';
import { PantryScreen } from '../screens/pantry/PantryScreen';
import { TemplatesScreen } from '../screens/templates/TemplatesScreen';
import { TemplateDetailScreen } from '../screens/templates/TemplateDetailScreen';
import { CreateTemplateScreen } from '../screens/templates/CreateTemplateScreen';
import { MoreScreen } from '../screens/more/MoreScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { FavoritesScreen } from '../screens/more/FavoritesScreen';
import { StatsScreen } from '../screens/more/StatsScreen';
import { AboutScreen } from '../screens/more/AboutScreen';
import { colors } from '../theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const createEmojiIcon = (emoji: string) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <Text style={[styles.tabIcon, { color, fontSize: size, opacity: focused ? 1 : 0.6 }]}>
      {emoji}
    </Text>
  );

const ListsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ListDetail" component={ListDetailScreen} />
      <Stack.Screen
        name="CreateList"
        component={CreateListScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="ShoppingMode" component={ShoppingModeScreen} />
    </Stack.Navigator>
  );
};

const TemplatesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      <Stack.Screen name="TemplatesHome" component={TemplatesScreen} />
      <Stack.Screen name="TemplateDetail" component={TemplateDetailScreen} />
      <Stack.Screen
        name="CreateTemplate"
        component={CreateTemplateScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

const MoreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      <Stack.Screen name="MoreHome" component={MoreScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
        },
      }}
    >
      <Tab.Screen
        name="Lists"
        component={ListsStack}
        options={{
          tabBarIcon: createEmojiIcon('📝'),
        }}
      />
      <Tab.Screen
        name="Pantry"
        component={PantryScreen}
        options={{
          tabBarIcon: createEmojiIcon('🏪'),
        }}
      />
      <Tab.Screen
        name="Templates"
        component={TemplatesStack}
        options={{
          tabBarIcon: createEmojiIcon('📋'),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{
          tabBarIcon: createEmojiIcon('⋯'),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    textAlign: 'center',
  },
});
