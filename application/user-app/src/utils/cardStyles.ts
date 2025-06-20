import { colors } from '../theme/constants';
import type { PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core';

// Simple color derivation for punch cards
export interface CardColors {
  frontHeaderBg: string;
  frontBodyBg: string;
  backHeaderBg: string;
  backBodyBg: string;
  punchIconColor: string;
  textColor: string;
}

// Default SVG content for filled and unfilled circles
const DEFAULT_FILLED_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="currentColor" />
</svg>
`;

const DEFAULT_UNFILLED_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" stroke-width="4" stroke-dasharray="8 4" />
</svg>
`;

// Default punch icons
const DEFAULT_PUNCH_ICONS: PunchIconsDto = {
  filled: {
    type: 'svg',
    data: {
      svg_raw_content: DEFAULT_FILLED_SVG
    }
  },
  unfilled: {
    type: 'svg',
    data: {
      svg_raw_content: DEFAULT_UNFILLED_SVG
    }
  }
};

// New comprehensive styles interface - ALL FINAL VALUES
export interface CustomizableCardStyles {
  colors: CardColors;
  logoUrl: string | null; // Can be null (no logo is valid)
  punchIcons: PunchIconsDto; // Always has a value (custom or default)
  backgroundImageUrl: string | null; // Can be null (no background is valid)
}

// New single resolver function - resolves ALL defaults
export function resolveCardStyles(
  cardStyles?: PunchCardStyleDto | null
): CustomizableCardStyles {
  // Derive colors once (always has defaults)
  const resolvedColors = deriveCardColors(cardStyles?.primaryColor, cardStyles?.secondaryColor);
  
  return {
    colors: resolvedColors,
    logoUrl: cardStyles?.logoUrl || null,
    punchIcons: cardStyles?.punchIcons || DEFAULT_PUNCH_ICONS, // Always resolved
    backgroundImageUrl: cardStyles?.backgroundImageUrl || null,
  };
}

// Keep existing function for backward compatibility during transition
export function deriveCardColors(
  primaryColor?: string | null, 
  secondaryColor?: string | null
): CardColors {
  // Use provided colors or fall back to defaults
  const primary = primaryColor || colors.primary;
  const secondary = secondaryColor || colors.secondary;

  // Primary for ALL backgrounds (monochromatic), secondary for text contrast
  return {
    frontHeaderBg: primary,
    frontBodyBg: lightenColor(primary, 0.4), // Much lighter primary
    backHeaderBg: darkenColor(primary, 0.2), // Slightly darker primary
    backBodyBg: lightenColor(primary, 0.6), // Very light primary
    punchIconColor: primary,
    textColor: secondary, // Secondary provides text contrast
  };
}

// Simple color manipulation functions
function lightenColor(color: string, amount: number): string {
  // Convert hex to RGB, lighten, convert back
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));
  
  return `rgb(${newR}, ${newG}, ${newB})`;
}

function darkenColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.max(0, Math.round(r * (1 - amount)));
  const newG = Math.max(0, Math.round(g * (1 - amount)));
  const newB = Math.max(0, Math.round(b * (1 - amount)));
  
  return `rgb(${newR}, ${newG}, ${newB})`;
} 