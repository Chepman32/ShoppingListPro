/**
 * App Navigator
 * Main navigation configuration
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import type { StackNavigationOptions } from '@react-navigation/stack';
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
import { RecentsScreen } from '../screens/more/RecentsScreen';
import { MealPlannerScreen } from '../screens/mealPlan/MealPlannerScreen';
import { AddMealScreen } from '../screens/mealPlan/AddMealScreen';
import { GenerateShoppingListScreen } from '../screens/mealPlan/GenerateShoppingListScreen';
import { ProductScreen } from '../screens/products/ProductScreen';
import { colors } from '../theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const createEmojiIcon = (emoji: string) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <Text style={[styles.tabIcon, { color, fontSize: size, opacity: focused ? 1 : 0.6 }]}>
      {emoji}
    </Text>
  );

const baseStackScreenOptions: StackNavigationOptions = {
  headerShown: true,
  headerBackTitleVisible: false,
  animationEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const ListsStack = () => {
  return (
    <Stack.Navigator screenOptions={baseStackScreenOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false, title: 'Lists' }}
      />
      <Stack.Screen
        name="ListDetail"
        component={ListDetailScreen}
        options={{ title: 'List' }}
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={{ title: 'Product' }}
      />
      <Stack.Screen
        name="CreateList"
        component={CreateListScreen}
        options={{
          presentation: 'modal',
          title: 'Create List',
        }}
      />
      <Stack.Screen
        name="ShoppingMode"
        component={ShoppingModeScreen}
        options={{ title: 'Shopping Mode' }}
      />
    </Stack.Navigator>
  );
};

const TemplatesStack = () => {
  return (
    <Stack.Navigator screenOptions={baseStackScreenOptions}>
      <Stack.Screen
        name="TemplatesHome"
        component={TemplatesScreen}
        options={{ headerShown: false, title: 'Templates' }}
      />
      <Stack.Screen
        name="TemplateDetail"
        component={TemplateDetailScreen}
        options={{ title: 'Template' }}
      />
      <Stack.Screen
        name="CreateTemplate"
        component={CreateTemplateScreen}
        options={{
          presentation: 'modal',
          title: 'New Template',
        }}
      />
    </Stack.Navigator>
  );
};

const MealPlanStack = () => {
  return (
    <Stack.Navigator screenOptions={baseStackScreenOptions}>
      <Stack.Screen
        name="MealPlannerHome"
        component={MealPlannerScreen}
        options={{ headerShown: false, title: 'Meal Planner' }}
      />
      <Stack.Screen
        name="AddMeal"
        component={AddMealScreen}
        options={{
          presentation: 'modal',
          title: 'Add Meal',
        }}
      />
      <Stack.Screen
        name="GenerateShoppingList"
        component={GenerateShoppingListScreen}
        options={{
          presentation: 'modal',
          title: 'Generate List',
        }}
      />
    </Stack.Navigator>
  );
};

const MoreStack = () => {
  return (
    <Stack.Navigator screenOptions={baseStackScreenOptions}>
      <Stack.Screen
        name="MoreHome"
        component={MoreScreen}
        options={{ headerShown: false, title: 'More' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: 'Statistics' }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About' }}
      />
      <Stack.Screen
        name="Recents"
        component={RecentsScreen}
        options={{ title: 'Recent Items' }}
      />
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
        name="MealPlan"
        component={MealPlanStack}
        options={{
          tabBarIcon: createEmojiIcon('📅'),
          tabBarLabel: 'Meal Plan',
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
