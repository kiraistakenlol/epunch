import { colors, spacing, borderRadius, shadows, typography, animation } from '../theme/constants';

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
  root.style.setProperty('--color-background-overlay', colors.background.overlay);
  
  // Text colors
  root.style.setProperty('--color-text-primary', colors.text.primary);
  root.style.setProperty('--color-text-secondary', colors.text.secondary);
  root.style.setProperty('--color-text-light', colors.text.light);
  root.style.setProperty('--color-text-disabled', colors.text.disabled);
  
  // Border colors
  root.style.setProperty('--color-border-default', colors.border.default);
  root.style.setProperty('--color-border-divider', colors.border.divider);
  root.style.setProperty('--color-border-focus', colors.border.focus);
  
  // Success/Error/Warning colors
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-success-dark', colors.successDark);
  root.style.setProperty('--color-success-light', colors.successLight);
  root.style.setProperty('--color-error', colors.error);
  root.style.setProperty('--color-error-dark', colors.errorDark);
  root.style.setProperty('--color-error-light', colors.errorLight);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-info', colors.info);
  
  // Hover states
  root.style.setProperty('--color-hover-primary', colors.hover.primary);
  root.style.setProperty('--color-hover-secondary', colors.hover.secondary);
  root.style.setProperty('--color-hover-selected', colors.hover.selected);
  
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
  root.style.setProperty('--border-radius-xlarge', borderRadius.xlarge);
  
  // Shadows
  root.style.setProperty('--shadow-none', shadows.none);
  root.style.setProperty('--shadow-light', shadows.light);
  root.style.setProperty('--shadow-medium', shadows.medium);
  root.style.setProperty('--shadow-heavy', shadows.heavy);
  
  // Typography
  root.style.setProperty('--font-family', typography.fontFamily);
  root.style.setProperty('--font-size-large', typography.fontSize.css.large);
  root.style.setProperty('--font-size-medium', typography.fontSize.css.medium);
  root.style.setProperty('--font-size-small', typography.fontSize.css.small);
  root.style.setProperty('--font-size-xsmall', typography.fontSize.css.xsmall);
  root.style.setProperty('--font-size-h4', typography.fontSize.desktop.h4);
  root.style.setProperty('--font-size-h6', typography.fontSize.desktop.h6);
  root.style.setProperty('--font-size-body', typography.fontSize.desktop.body);
  root.style.setProperty('--font-size-caption', typography.fontSize.desktop.caption);
  root.style.setProperty('--font-weight-normal', `${typography.fontWeight.normal}`);
  root.style.setProperty('--font-weight-medium', `${typography.fontWeight.medium}`);
  root.style.setProperty('--font-weight-bold', `${typography.fontWeight.bold}`);
  root.style.setProperty('--font-weight-600', `${typography.fontWeight[600]}`);
  
  // Animation
  root.style.setProperty('--animation-duration-standard', `${animation.duration.standard}ms`);
  root.style.setProperty('--animation-duration-short', `${animation.duration.short}ms`);
  root.style.setProperty('--animation-easing', animation.easing.easeInOut);
  
  // Z-index
  root.style.setProperty('--z-modal', '1300');
  root.style.setProperty('--z-overlay', '1200');
  root.style.setProperty('--z-dropdown', '1100');
}; 