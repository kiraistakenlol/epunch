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
  root.style.setProperty('--color-bg-default', colors.background.default);
  root.style.setProperty('--color-bg-paper', colors.background.paper);
  root.style.setProperty('--color-bg-variant', colors.background.variant);
  
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
  root.style.setProperty('--border-radius-small', borderRadius.small);
  root.style.setProperty('--border-radius-medium', borderRadius.medium);
  root.style.setProperty('--border-radius-large', borderRadius.large);
  
  // Shadows
  root.style.setProperty('--shadow-light', shadows.light);
  root.style.setProperty('--shadow-medium', shadows.medium);
  root.style.setProperty('--shadow-heavy', shadows.heavy);
}; 