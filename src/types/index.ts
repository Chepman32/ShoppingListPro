/**
 * Type Exports
 * Central export point for all TypeScript types
 */

import type { ProductNavigationParams } from './product';

export * from './database';
export * from './product';
export type {
  Theme,
  ColorName,
  CategoryColor,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow
} from '../theme';

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  ListDetail: { listId: string };
  CreateList: undefined;
  ShoppingMode: { listId: string };
  Pantry: undefined;
  TemplatesHome: undefined;
  TemplateDetail: { templateId: string };
  CreateTemplate: undefined;
  MoreHome: undefined;
  Settings: undefined;
  Favorites: undefined;
  Stats: undefined;
  About: undefined;
  Product: ProductNavigationParams;
};

// Component prop types
export interface BaseComponentProps {
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
}

// Store types
export interface ListStats {
  totalItems: number;
  checkedItems: number;
  uncheckedItems: number;
  completionPercentage: number;
  estimatedCost: number;
}
