/**
 * Design System - Main Export
 * Consolidates all design tokens
 */

export { colors } from './colors';
export type { ColorName, CategoryColor } from './colors';

export { typography } from './typography';
export type { FontSize, FontWeight } from './typography';

export { spacing } from './spacing';
export type { Spacing } from './spacing';

export { borderRadius } from './borderRadius';
export type { BorderRadius } from './borderRadius';

export { shadows } from './shadows';
export type { Shadow } from './shadows';

// Theme configuration
export interface Theme {
  colors: typeof import('./colors').colors;
  typography: typeof import('./typography').typography;
  spacing: typeof import('./spacing').spacing;
  borderRadius: typeof import('./borderRadius').borderRadius;
  shadows: typeof import('./shadows').shadows;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: require('./colors').colors,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  borderRadius: require('./borderRadius').borderRadius,
  shadows: require('./shadows').shadows,
  isDark: false,
};

export const darkTheme: Theme = {
  ...lightTheme,
  isDark: true,
};
