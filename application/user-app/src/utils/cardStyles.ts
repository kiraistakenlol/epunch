import type { PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core';

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
  punchIcons: {
    filled: NonNullable<PunchIconsDto['filled']>;
    unfilled: NonNullable<PunchIconsDto['unfilled']>;
  };
}

export function resolveCardStyles(
  customization?: PunchCardStyleDto | null
): CustomizableCardStyles {
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
    punchIcons: resolvedPunchIcons,
  };
}

 