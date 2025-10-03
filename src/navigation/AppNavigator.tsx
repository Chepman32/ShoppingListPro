/**
 * App Navigator
 * Main navigation configuration
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/lists/HomeScreen';
import { ListDetailScreen } from '../screens/lists/ListDetailScreen';
import { CreateListScreen } from '../screens/lists/CreateListScreen';
import { ShoppingModeScreen } from '../screens/shopping/ShoppingModeScreen';
import { PantryScreen } from '../screens/pantry/PantryScreen';
import { RecipesScreen } from '../screens/recipes/RecipesScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { colors } from '../theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
          tabBarIcon: () => '📝',
        }}
      />
      <Tab.Screen
        name="Pantry"
        component={PantryScreen}
        options={{
          tabBarIcon: () => '🏪',
        }}
      />
      <Tab.Screen
        name="Recipes"
        component={RecipesScreen}
        options={{
          tabBarIcon: () => '📖',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: () => '⚙️',
        }}
      />
    </Tab.Navigator>
  );
};
