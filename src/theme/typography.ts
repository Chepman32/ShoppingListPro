/**
 * Design System - Typography
 * Based on ListFlow SDD Appendix A
 */

export const typography = {
  // Font Families
  fontRegular: 'System',
  fontMedium: 'System',
  fontBold: 'System',

  // Font Sizes
  h1: 34,
  h2: 28,
  h3: 22,
  h4: 20,
  body: 17,
  bodySmall: 15,
  caption: 13,
  tiny: 11,

  // Line Heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,

  // Font Weights
  weightRegular: '400' as const,
  weightMedium: '500' as const,
  weightSemibold: '600' as const,
  weightBold: '700' as const,
} as const;

export type FontSize = keyof Pick<typeof typography, 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'tiny'>;
export type FontWeight = typeof typography.weightRegular | typeof typography.weightMedium | typeof typography.weightSemibold | typeof typography.weightBold;
