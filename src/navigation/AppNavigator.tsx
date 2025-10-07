/**
 * App Navigator
 * Main navigation configuration
 */

import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeScreen } from '../screens/lists/HomeScreen';
import { ListDetailScreen } from '../screens/lists/ListDetailScreen';
import { CreateListScreen } from '../screens/lists/CreateListScreen';
import { ShoppingModeScreen } from '../screens/shopping/ShoppingModeScreen';
import { TemplatesScreen } from '../screens/templates/TemplatesScreen';
import { TemplateDetailScreen } from '../screens/templates/TemplateDetailScreen';
import { CreateTemplateScreen } from '../screens/templates/CreateTemplateScreen';
import { MoreScreen } from '../screens/more/MoreScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { CloudSyncScreen } from '../screens/settings/CloudSyncScreen';
import { FavoritesScreen } from '../screens/more/FavoritesScreen';
import { StatsScreen } from '../screens/more/StatsScreen';
import { AboutScreen } from '../screens/more/AboutScreen';
import { RecentsScreen } from '../screens/more/RecentsScreen';
import { MealPlannerScreen } from '../screens/mealPlan/MealPlannerScreen';
import { ProductScreen } from '../screens/products/ProductScreen';
import { PantryScreen } from '../screens/pantry/PantryScreen';
import { useTheme } from '../ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const createIcon = (iconName: string, focusedIconName?: string) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <Icon name={focused ? (focusedIconName || iconName) : iconName} size={size} color={color} />
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
          headerShown: false,
          title: 'Create List',
        }}
      />
      <Stack.Screen
        name="ShoppingMode"
        component={ShoppingModeScreen}
        options={{ title: 'Shopping Mode' }}
      />
      <Stack.Screen
        name="Recents"
        component={RecentsScreen}
        options={{ title: 'Recent Items' }}
      />
      <Stack.Screen
        name="MealPlannerFromHome"
        component={MealPlannerScreen}
        options={{ title: 'Meal Planner' }}
      />
      <Stack.Screen
        name="CloudSync"
        component={CloudSyncScreen}
        options={{ title: 'Cloud Sync' }}
      />
      <Stack.Screen
        name="Pantry"
        component={PantryScreen}
        options={{ title: 'Pantry' }}
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
        name="CloudSync"
        component={CloudSyncScreen}
        options={{ title: 'Cloud Sync' }}
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
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.borderLight,
        },
      }}
    >
      <Tab.Screen
        name="Lists"
        component={ListsStack}
        options={{
          tabBarLabel: t('navigation.lists'),
          tabBarIcon: createIcon('list-outline', 'list'),
        }}
      />
      <Tab.Screen
        name="Templates"
        component={TemplatesStack}
        options={{
          tabBarLabel: t('navigation.templates'),
          tabBarIcon: createIcon('clipboard-outline', 'clipboard'),
        }}
      />
      <Tab.Screen
        name="Premium"
        component={MoreStack}
        options={{
          tabBarLabel: t('navigation.premium'),
          tabBarIcon: createIcon('diamond-outline', 'diamond'),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{
          tabBarLabel: t('navigation.more'),
          tabBarIcon: createIcon('ellipsis-horizontal', 'ellipsis-horizontal'),
        }}
      />
    </Tab.Navigator>
  );
};
