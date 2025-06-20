import { colors, zIndex } from '../theme/constants';

export const injectCSSVariables = () => {
  const root = document.documentElement;
  
  // Primary colors
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-light', colors.primaryLight);
  root.style.setProperty('--color-primary-dark', colors.primaryDark);
  
  // Secondary colors
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-secondary-light', colors.secondaryLight);
  root.style.setProperty('--color-secondary-dark', colors.secondaryDark);
  
  // Background colors
  root.style.setProperty('--color-background-default', colors.background.default);
  root.style.setProperty('--color-background-paper', colors.background.paper);
  root.style.setProperty('--color-background-card', colors.background.card);
  root.style.setProperty('--color-background-preview', colors.background.preview);
  root.style.setProperty('--color-background-overlay', colors.background.overlay);
  
  // Text colors
  root.style.setProperty('--color-text-primary', colors.text.primary);
  root.style.setProperty('--color-text-secondary', colors.text.secondary);
  root.style.setProperty('--color-text-light', colors.text.light);
  root.style.setProperty('--color-text-accent', colors.text.accent);
  root.style.setProperty('--color-text-disabled', colors.text.disabled);
  
  // State colors
  root.style.setProperty('--color-success', colors.success.main);
  root.style.setProperty('--color-success-dark', colors.success.dark);
  root.style.setProperty('--color-success-light', colors.success.light);
  root.style.setProperty('--color-error', colors.error.main);
  root.style.setProperty('--color-error-dark', colors.error.dark);
  root.style.setProperty('--color-error-light', colors.error.light);
  root.style.setProperty('--color-warning', colors.warning.main);
  root.style.setProperty('--color-warning-light', colors.warning.light);
  root.style.setProperty('--color-info', colors.info.main);
  root.style.setProperty('--color-info-slate', colors.info.slate);
  
  // Special colors
  root.style.setProperty('--color-reward-ready', colors.reward.ready);
  root.style.setProperty('--color-reward-selected', colors.reward.selected);
  root.style.setProperty('--color-reward-glow', colors.reward.glow);
  root.style.setProperty('--color-reward-selected-bg', colors.reward.selectedBg);
  root.style.setProperty('--color-reward-selected-bg-hover', colors.reward.selectedBgHover);
  root.style.setProperty('--color-reward-selected-border', colors.reward.selectedBorder);
  root.style.setProperty('--color-reward-ready-bg', colors.reward.readyBg);
  root.style.setProperty('--color-reward-ready-bg-hover', colors.reward.readyBgHover);
  root.style.setProperty('--color-reward-ready-border', colors.reward.readyBorder);
  
  // Interactive states
  root.style.setProperty('--color-hover-primary', colors.hover.primary);
  root.style.setProperty('--color-hover-background', colors.hover.background);

  // Button colors
  root.style.setProperty('--color-button-google', colors.button.google);
  root.style.setProperty('--color-button-google-hover', colors.button.googleHover);
  root.style.setProperty('--color-button-orange', colors.button.orange);
  root.style.setProperty('--color-button-orange-hover', colors.button.orangeHover);
  root.style.setProperty('--color-button-danger', colors.button.danger);
  root.style.setProperty('--color-button-danger-hover', colors.button.dangerHover);
  root.style.setProperty('--color-button-dark-red', colors.button.darkRed);
  root.style.setProperty('--color-button-cancel', colors.button.cancel);
  root.style.setProperty('--color-button-cancel-hover', colors.button.cancelHover);

  // Modal colors
  root.style.setProperty('--color-modal-background', colors.modal.background);
  root.style.setProperty('--color-modal-text', colors.modal.text);
  root.style.setProperty('--color-modal-border', colors.modal.border);
  root.style.setProperty('--color-modal-error-bg', colors.modal.errorBg);
  root.style.setProperty('--color-modal-error-text', colors.modal.errorText);
  root.style.setProperty('--color-modal-overlay', colors.modal.overlay);
  
  // Shadow colors
  root.style.setProperty('--color-shadow-overlay', colors.shadow.overlay);
  root.style.setProperty('--color-shadow-border', colors.shadow.border);
  root.style.setProperty('--color-shadow-text-accent', colors.shadow.textAccent);
  
  // Z-index
  root.style.setProperty('--z-modal', `${zIndex.modal}`);
  root.style.setProperty('--z-overlay', `${zIndex.overlay}`);
  root.style.setProperty('--z-dropdown', `${zIndex.dropdown}`);
  root.style.setProperty('--z-header', `${zIndex.header}`);
  root.style.setProperty('--z-card', `${zIndex.card}`);
  root.style.setProperty('--z-content', `${zIndex.content}`);
}; 