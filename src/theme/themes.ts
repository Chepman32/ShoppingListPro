/**
 * Theme Definitions
 * Supports: Light, Dark, Solar, Mono
 */

export type ThemeMode = 'light' | 'dark' | 'solar' | 'mono';

export interface ThemeColors {
  // Primary
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // Secondary
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;

  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;

  // Backgrounds
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  surface: string;
  surfaceSecondary: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;

  // Borders
  border: string;
  borderLight: string;

  overlay: string;
}

// Light Theme
export const lightTheme: ThemeColors = {
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA3FF',

  secondary: '#34C759',
  secondaryDark: '#248A3D',
  secondaryLight: '#62D77B',

  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',

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
};

// Dark Theme
export const darkTheme: ThemeColors = {
  primary: '#0A84FF',
  primaryDark: '#0051D5',
  primaryLight: '#64A8FF',

  secondary: '#30D158',
  secondaryDark: '#248A3D',
  secondaryLight: '#62D77B',

  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',

  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',

  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',

  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  textDisabled: '#48484A',

  border: '#38383A',
  borderLight: '#48484A',

  overlay: 'rgba(0, 0, 0, 0.6)',
};

// Solar Theme (warm, light yellow shades)
export const solarTheme: ThemeColors = {
  primary: '#D97706',
  primaryDark: '#B45309',
  primaryLight: '#F59E0B',

  secondary: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#34D399',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  background: '#FEF3C7',
  backgroundSecondary: '#FDE68A',
  backgroundTertiary: '#FCD34D',

  surface: '#FFFBEB',
  surfaceSecondary: '#FEF3C7',

  text: '#451A03',
  textSecondary: '#78350F',
  textTertiary: '#92400E',
  textDisabled: '#D97706',

  border: '#FCD34D',
  borderLight: '#FDE68A',

  overlay: 'rgba(69, 26, 3, 0.4)',
};

// Mono Theme (medium gray shades)
export const monoTheme: ThemeColors = {
  primary: '#3A3A3A',
  primaryDark: '#2A2A2A',
  primaryLight: '#4A4A4A',

  secondary: '#505050',
  secondaryDark: '#3A3A3A',
  secondaryLight: '#6A6A6A',

  success: '#4A4A4A',
  warning: '#5A5A5A',
  error: '#2A2A2A',
  info: '#4A4A4A',

  background: '#3A3A3A',
  backgroundSecondary: '#4A4A4A',
  backgroundTertiary: '#5A5A5A',

  surface: '#C0C0C0',
  surfaceSecondary: '#B0B0B0',

  text: '#E5E5E5',
  textSecondary: '#2A2A2A',
  textTertiary: '#505050',
  textDisabled: '#808080',

  border: '#5A5A5A',
  borderLight: '#4E4E4E',

  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const themes: Record<ThemeMode, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme,
  solar: solarTheme,
  mono: monoTheme,
};

// Category Colors (shared across all themes)
export const categoryColors = {
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
};
