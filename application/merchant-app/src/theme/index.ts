import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  layout,
  breakpoints,
  animation,
  gradients,
  variants,
} from './constants';

// Re-export for convenience
export * from './constants';

// Design system utilities
export const designTokens = {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  layout,
  breakpoints,
  animation,
  gradients,
  variants,
};

// Helper functions for responsive design
export const responsive = {
  mobile: `@media (max-width: ${breakpoints.sm - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.md}px)`,
  largeDesktop: `@media (min-width: ${breakpoints.lg}px)`,
};

// Helper function to get spacing values
export const getSpacing = (multiplier: number): string => `${spacing.md * multiplier}px`;

// Helper function to get responsive font size
export const getResponsiveFontSize = (
  variant: keyof typeof typography.fontSize.mobile,
  isMobile: boolean
): string => {
  return isMobile 
    ? typography.fontSize.mobile[variant]
    : typography.fontSize.desktop[variant];
}; 