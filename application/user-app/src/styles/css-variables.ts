import { appColors, zIndex } from '../theme/constants';

export const injectCSSVariables = () => {
  const root = document.documentElement;
  
  // Base colors
  root.style.setProperty('--color-epunch-mint', appColors.epunchMint);
  root.style.setProperty('--color-epunch-brown', appColors.epunchBrown);
  root.style.setProperty('--color-epunch-beige', appColors.epunchBeige);
  root.style.setProperty('--color-epunch-black', appColors.epunchBlack);
  root.style.setProperty('--color-epunch-white', appColors.epunchWhite);
  root.style.setProperty('--color-epunch-gray', appColors.epunchGray);
  root.style.setProperty('--color-epunch-green', appColors.epunchGreen);
  root.style.setProperty('--color-epunch-gold', appColors.epunchGold);
  
  // Z-index
  root.style.setProperty('--z-modal', `${zIndex.modal}`);
  root.style.setProperty('--z-overlay', `${zIndex.overlay}`);
  root.style.setProperty('--z-dropdown', `${zIndex.dropdown}`);
  root.style.setProperty('--z-header', `${zIndex.header}`);
  root.style.setProperty('--z-card', `${zIndex.card}`);
  root.style.setProperty('--z-content', `${zIndex.content}`);
}; 