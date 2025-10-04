/**
 * Favorites Types
 * Defines the different favorite entities supported by the app
 */

import type { ProductDetails } from './product';

export type FavoriteItemType = 'list' | 'template' | 'product';

export interface FavoriteListEntry {
  type: 'list';
  id: string;
  name: string;
  icon?: string;
  color?: string;
  favoritedAt: string;
}

export interface FavoriteTemplateEntry {
  type: 'template';
  id: string;
  name: string;
  isPredefined: boolean;
  favoritedAt: string;
}

export interface FavoriteProductEntry {
  type: 'product';
  id: string;
  name: string;
  product: ProductDetails;
  sourceListId?: string;
  sourceListName?: string;
  sourceListItemId?: string;
  favoritedAt: string;
}

export type FavoriteEntry =
  | FavoriteListEntry
  | FavoriteTemplateEntry
  | FavoriteProductEntry;
