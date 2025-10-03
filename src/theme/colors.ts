/**
 * Design System - Colors
 * Based on ListFlow SDD Appendix A
 */

export const colors = {
  // Primary
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA3FF',

  // Secondary
  secondary: '#34C759',
  secondaryDark: '#248A3D',
  secondaryLight: '#62D77B',

  // Semantic
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',

  // Neutrals (Light Mode)
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  backgroundTertiary: '#E5E5EA',

  surface: '#FFFFFF',
  surfaceSecondary: '#F9F9F9',

  text: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  textDisabled: '#C7C7CC',

  border: '#C6C6C8',
  borderLight: '#E5E5EA',

  overlay: 'rgba(0, 0, 0, 0.4)',

  // Dark Mode
  dark: {
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',

    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',

    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',

    border: '#38383A',
    borderLight: '#48484A',
  },

  // Category Colors
  categories: {
    produce: '#34C759',
    dairy: '#5AC8FA',
    meat: '#FF3B30',
    bakery: '#FF9500',
    frozen: '#5856D6',
    pantry: '#AF52DE',
    beverages: '#00C7BE',
    snacks: '#FF2D55',
    personal: '#FF6482',
    household: '#8E8E93',
    baby: '#FFD60A',
    pet: '#BF5AF2',
    pharmacy: '#32ADE6',
    other: '#98989D',
  },
} as const;

export type ColorName = keyof typeof colors;
export type CategoryColor = keyof typeof colors.categories;
