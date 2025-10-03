/**
 * Database Type Definitions
 */

export interface CreateListData {
  name: string;
  icon: string;
  color: string;
  storeLocation?: string;
  budget?: number;
}

export interface CreateItemData {
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  notes?: string;
  price?: number;
}

export interface CreatePantryItemData {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: 'fridge' | 'pantry' | 'freezer';
  expiryDate?: Date;
  lowStockThreshold?: number;
  notes?: string;
  barcode?: string;
}

export interface CreateRecipeData {
  name: string;
  description?: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  instructions: string;
  imageUri?: string;
}

export interface CreateRecipeIngredientData {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}
