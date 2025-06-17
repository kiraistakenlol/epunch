import { colors, spacing, borderRadius, shadows } from '../theme/constants';

export const injectCSSVariables = () => {
  const root = document.documentElement;
  
  // Colors
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-light', colors.primaryLight);
  root.style.setProperty('--color-primary-dark', colors.primaryDark);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-secondary-light', colors.secondaryLight);
  root.style.setProperty('--color-secondary-dark', colors.secondaryDark);
  
  // Background colors
  root.style.setProperty('--color-background-default', colors.background.default);
  root.style.setProperty('--color-background-paper', colors.background.paper);
  root.style.setProperty('--color-background-variant', colors.background.variant);
  root.style.setProperty('--color-background-hover', colors.hover.background);
  
  // Text colors
  root.style.setProperty('--color-text-primary', colors.text.primary);
  root.style.setProperty('--color-text-secondary', colors.text.secondary);
  root.style.setProperty('--color-text-light', colors.text.light);
  
  // Border colors
  root.style.setProperty('--color-border-default', colors.border.default);
  root.style.setProperty('--color-border-divider', colors.border.divider);
  
  // Success/Error colors
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-success-dark', colors.successDark);
  root.style.setProperty('--color-success-light', colors.successLight);
  root.style.setProperty('--color-error', colors.error);
  root.style.setProperty('--color-error-dark', colors.errorDark);
  root.style.setProperty('--color-error-light', colors.errorLight);
  
  // Spacing
  root.style.setProperty('--spacing-xs', `${spacing.xs}px`);
  root.style.setProperty('--spacing-sm', `${spacing.sm}px`);
  root.style.setProperty('--spacing-md', `${spacing.md}px`);
  root.style.setProperty('--spacing-lg', `${spacing.lg}px`);
  root.style.setProperty('--spacing-xl', `${spacing.xl}px`);
  root.style.setProperty('--spacing-xxl', `${spacing.xxl}px`);
  
  // Border radius
  root.style.setProperty('--border-radius-sm', borderRadius.small);
  root.style.setProperty('--border-radius-md', borderRadius.medium);
  root.style.setProperty('--border-radius-lg', borderRadius.large);
  
  // Shadows
  root.style.setProperty('--shadow-light', shadows.light);
  root.style.setProperty('--shadow-medium', shadows.medium);
  root.style.setProperty('--shadow-heavy', shadows.heavy);
  
  // Typography
  root.style.setProperty('--font-size-lg', '1.25rem');
  root.style.setProperty('--font-weight-bold', '600');
  
  // Z-index
  root.style.setProperty('--z-modal', '1300');
}; 