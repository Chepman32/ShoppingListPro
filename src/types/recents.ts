/**
 * Recents Types
 * Defines recently accessed items in the app
 */

import type { ProductDetails } from './product';

export type RecentItemType = 'list' | 'template' | 'product' | 'mealPlan';

export interface RecentListEntry {
  type: 'list';
  id: string;
  name: string;
  icon?: string;
  color?: string;
  accessedAt: string;
}

export interface RecentTemplateEntry {
  type: 'template';
  id: string;
  name: string;
  isPredefined: boolean;
  accessedAt: string;
}

export interface RecentProductEntry {
  type: 'product';
  id: string;
  name: string;
  product: ProductDetails;
  sourceListId?: string;
  sourceListName?: string;
  accessedAt: string;
}

export interface RecentMealPlanEntry {
  type: 'mealPlan';
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mealName?: string;
  accessedAt: string;
}

export type RecentEntry =
  | RecentListEntry
  | RecentTemplateEntry
  | RecentProductEntry
  | RecentMealPlanEntry;
