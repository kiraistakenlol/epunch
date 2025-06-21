import { appColors } from '../theme/constants';
import type { PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core';

export interface CardColors {
  frontHeaderBg: string;
  frontBodyBg: string;
  backHeaderBg: string;
  backBodyBg: string;
  punchIconColor: string;
  textColor: string;
}

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

export interface CustomizableCardStyles {
  colors: CardColors;
  logoUrl: string | null;
  punchIcons: PunchIconsDto;
  backgroundImageUrl: string | null;
}

export function resolveCardStyles(
  customization?: PunchCardStyleDto | null
): CustomizableCardStyles {
  const resolvedColors = deriveCardColors(customization?.primaryColor, customization?.secondaryColor);
  
  return {
    colors: resolvedColors,
    logoUrl: customization?.logoUrl || null,
    punchIcons: customization?.punchIcons || DEFAULT_PUNCH_ICONS,
    backgroundImageUrl: customization?.backgroundImageUrl || null,
  };
}

function deriveCardColors(
  primaryColor?: string | null, 
  secondaryColor?: string | null
): CardColors {
  const primary = primaryColor || appColors.epunchBrown;
  const secondary = secondaryColor || appColors.epunchWhite;

  return {
    frontHeaderBg: primary,
    frontBodyBg: lightenColor(primary, 0.4),
    backHeaderBg: darkenColor(primary, 0.2),
    backBodyBg: lightenColor(primary, 0.6),
    punchIconColor: primary,
    textColor: secondary,
  };
}

function lightenColor(color: string, amount: number): string {
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