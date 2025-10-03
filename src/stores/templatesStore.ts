/**
 * Templates Store
 * Manages shopping list templates using Zustand
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Template, CreateTemplateData, TemplateItem } from '../types/database';

const TEMPLATES_STORAGE_KEY = '@shopping_list_templates';

// Predefined templates
const PREDEFINED_TEMPLATES: Template[] = [
  {
    id: 'weekly-essentials',
    name: 'Weekly Essentials',
    isPredefined: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { name: 'Milk', quantity: 1, unit: 'gallon', category: 'Dairy' },
      { name: 'Bread', quantity: 1, unit: 'loaf', category: 'Bakery' },
      { name: 'Eggs', quantity: 1, unit: 'dozen', category: 'Dairy' },
      { name: 'Butter', quantity: 1, unit: 'lb', category: 'Dairy' },
      { name: 'Cheese', quantity: 1, unit: 'lb', category: 'Dairy' },
      { name: 'Fresh Vegetables', quantity: 1, unit: 'bag', category: 'Produce' },
      { name: 'Fresh Fruits', quantity: 1, unit: 'bag', category: 'Produce' },
      { name: 'Coffee', quantity: 1, unit: 'bag', category: 'Beverages' },
    ],
  },
  {
    id: 'taco-night',
    name: 'Taco Night',
    isPredefined: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { name: 'Tortillas', quantity: 12, unit: 'count', category: 'Bakery' },
      { name: 'Ground Beef', quantity: 1, unit: 'lb', category: 'Meat' },
      { name: 'Shredded Cheese', quantity: 1, unit: 'bag', category: 'Dairy' },
      { name: 'Salsa', quantity: 1, unit: 'jar', category: 'Condiments' },
      { name: 'Sour Cream', quantity: 1, unit: 'container', category: 'Dairy' },
      { name: 'Lettuce', quantity: 1, unit: 'head', category: 'Produce' },
      { name: 'Tomatoes', quantity: 2, unit: 'count', category: 'Produce' },
      { name: 'Taco Seasoning', quantity: 1, unit: 'packet', category: 'Spices' },
    ],
  },
  {
    id: 'breakfast-basics',
    name: 'Breakfast Basics',
    isPredefined: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { name: 'Eggs', quantity: 1, unit: 'dozen', category: 'Dairy' },
      { name: 'Bacon', quantity: 1, unit: 'lb', category: 'Meat' },
      { name: 'Bread', quantity: 1, unit: 'loaf', category: 'Bakery' },
      { name: 'Pancake Mix', quantity: 1, unit: 'box', category: 'Baking' },
      { name: 'Maple Syrup', quantity: 1, unit: 'bottle', category: 'Condiments' },
      { name: 'Orange Juice', quantity: 1, unit: 'carton', category: 'Beverages' },
      { name: 'Coffee', quantity: 1, unit: 'bag', category: 'Beverages' },
    ],
  },
  {
    id: 'party-supplies',
    name: 'Party Supplies',
    isPredefined: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { name: 'Paper Plates', quantity: 1, unit: 'pack', category: 'Party' },
      { name: 'Plastic Cups', quantity: 1, unit: 'pack', category: 'Party' },
      { name: 'Napkins', quantity: 1, unit: 'pack', category: 'Party' },
      { name: 'Chips', quantity: 3, unit: 'bags', category: 'Snacks' },
      { name: 'Dip', quantity: 2, unit: 'containers', category: 'Snacks' },
      { name: 'Soda', quantity: 2, unit: 'liters', category: 'Beverages' },
      { name: 'Ice', quantity: 1, unit: 'bag', category: 'Other' },
    ],
  },
  {
    id: 'healthy-snacks',
    name: 'Healthy Snacks',
    isPredefined: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { name: 'Greek Yogurt', quantity: 6, unit: 'cups', category: 'Dairy' },
      { name: 'Fresh Berries', quantity: 2, unit: 'pints', category: 'Produce' },
      { name: 'Almonds', quantity: 1, unit: 'bag', category: 'Snacks' },
      { name: 'Hummus', quantity: 1, unit: 'container', category: 'Deli' },
      { name: 'Baby Carrots', quantity: 1, unit: 'bag', category: 'Produce' },
      { name: 'Granola Bars', quantity: 1, unit: 'box', category: 'Snacks' },
      { name: 'String Cheese', quantity: 1, unit: 'pack', category: 'Dairy' },
    ],
  },
];

interface TemplatesState {
  templates: Template[];
  loading: boolean;

  // Actions
  fetchTemplates: () => Promise<void>;
  createTemplate: (data: CreateTemplateData) => Promise<Template>;
  updateTemplate: (id: string, data: Partial<CreateTemplateData>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  getTemplate: (id: string) => Template | undefined;
  getPredefinedTemplates: () => Template[];
  getUserTemplates: () => Template[];
}

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
  templates: [],
  loading: false,

  fetchTemplates: async () => {
    set({ loading: true });
    try {
      const stored = await AsyncStorage.getItem(TEMPLATES_STORAGE_KEY);
      const userTemplates = stored ? JSON.parse(stored) : [];

      // Parse dates
      userTemplates.forEach((template: Template) => {
        template.createdAt = new Date(template.createdAt);
        template.updatedAt = new Date(template.updatedAt);
      });

      set({
        templates: [...PREDEFINED_TEMPLATES, ...userTemplates],
        loading: false
      });
    } catch (error) {
      console.error('Error fetching templates:', error);
      set({ templates: PREDEFINED_TEMPLATES, loading: false });
    }
  },

  createTemplate: async (data) => {
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: data.name,
      items: data.items,
      isPredefined: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userTemplates = get().getUserTemplates();
    const updatedUserTemplates = [...userTemplates, newTemplate];

    await AsyncStorage.setItem(
      TEMPLATES_STORAGE_KEY,
      JSON.stringify(updatedUserTemplates)
    );

    set({ templates: [...PREDEFINED_TEMPLATES, ...updatedUserTemplates] });
    return newTemplate;
  },

  updateTemplate: async (id, data) => {
    const template = get().getTemplate(id);

    if (!template || template.isPredefined) {
      throw new Error('Cannot update predefined template');
    }

    const userTemplates = get().getUserTemplates();
    const updatedUserTemplates = userTemplates.map((t) =>
      t.id === id
        ? {
            ...t,
            name: data.name ?? t.name,
            items: data.items ?? t.items,
            updatedAt: new Date(),
          }
        : t
    );

    await AsyncStorage.setItem(
      TEMPLATES_STORAGE_KEY,
      JSON.stringify(updatedUserTemplates)
    );

    set({ templates: [...PREDEFINED_TEMPLATES, ...updatedUserTemplates] });
  },

  deleteTemplate: async (id) => {
    const template = get().getTemplate(id);

    if (!template) {
      throw new Error('Template not found');
    }

    if (template.isPredefined) {
      throw new Error('Cannot delete predefined template');
    }

    const userTemplates = get().getUserTemplates().filter((t) => t.id !== id);

    await AsyncStorage.setItem(
      TEMPLATES_STORAGE_KEY,
      JSON.stringify(userTemplates)
    );

    set({ templates: [...PREDEFINED_TEMPLATES, ...userTemplates] });
  },

  getTemplate: (id) => {
    return get().templates.find((t) => t.id === id);
  },

  getPredefinedTemplates: () => {
    return get().templates.filter((t) => t.isPredefined);
  },

  getUserTemplates: () => {
    return get().templates.filter((t) => !t.isPredefined);
  },
}));
