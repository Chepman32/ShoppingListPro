/**
 * Design System - Border Radius
 * Based on ListFlow SDD Appendix A
 */

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
} as const;

export type BorderRadius = keyof typeof borderRadius;
