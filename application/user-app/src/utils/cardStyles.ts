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
  punchIcons: {
    filled: NonNullable<PunchIconsDto['filled']>;
    unfilled: NonNullable<PunchIconsDto['unfilled']>;
  };
  backgroundImageUrl: string | null;
}

export function resolveCardStyles(
  customization?: PunchCardStyleDto | null
): CustomizableCardStyles {
  const primary = customization?.primaryColor || appColors.epunchGray;
  const secondary = customization?.secondaryColor || appColors.epunchBlack;
  
  // Simplified - only create the colors we actually use
  const minimalColors: CardColors = {
    frontHeaderBg: primary, // Not used anymore
    frontBodyBg: primary, // Not used anymore  
    backHeaderBg: primary, // Not used anymore
    backBodyBg: lightenColor(primary, 0.6), // Still used for punch card back
    punchIconColor: primary, // Not used anymore
    textColor: secondary, // Not used anymore
  };
  
  // Handle individual icon nulls - use default for any missing icons
  let resolvedPunchIcons: CustomizableCardStyles['punchIcons'] = {
    filled: DEFAULT_PUNCH_ICONS.filled!,
    unfilled: DEFAULT_PUNCH_ICONS.unfilled!
  };
  
  if (customization?.punchIcons) {
    resolvedPunchIcons = {
      filled: customization.punchIcons.filled || DEFAULT_PUNCH_ICONS.filled!,
      unfilled: customization.punchIcons.unfilled || DEFAULT_PUNCH_ICONS.unfilled!
    };
  }
  
  return {
    colors: minimalColors,
    logoUrl: customization?.logoUrl || null,
    punchIcons: resolvedPunchIcons,
    backgroundImageUrl: customization?.backgroundImageUrl || null,
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

 