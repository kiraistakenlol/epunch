import { IconDto, PunchIcon, PunchIconsDto } from 'e-punch-common-core';

/**
 * Convert IconDto to PunchIcon format for storage
 */
export const iconDtoToPunchIcon = (iconDto: IconDto): PunchIcon => {
  return {
    type: 'svg',
    data: {
      svg_raw_content: iconDto.svg_content
    }
  };
};

/**
 * Convert PunchIcon back to IconDto format for display
 */
export const punchIconToIconDto = (punchIcon: PunchIcon, name?: string): IconDto => {
  return {
    id: name || 'custom-icon',
    name: name || 'Custom Icon',
    svg_content: punchIcon.data.svg_raw_content
  };
};

/**
 * Create PunchIconsDto from filled and unfilled IconDto objects
 */
export const createPunchIcons = (filledIcon: IconDto, unfilledIcon: IconDto): PunchIconsDto => {
  return {
    filled: iconDtoToPunchIcon(filledIcon),
    unfilled: iconDtoToPunchIcon(unfilledIcon)
  };
};

/**
 * Extract IconDto objects from PunchIconsDto
 */
export const extractIconsFromPunchIcons = (punchIcons: PunchIconsDto): {
  filled: IconDto;
  unfilled: IconDto;
} => {
  return {
    filled: punchIconToIconDto(punchIcons.filled, 'filled-icon'),
    unfilled: punchIconToIconDto(punchIcons.unfilled, 'unfilled-icon')
  };
};

/**
 * Validate that an icon has valid SVG content
 */
export const isValidIcon = (icon: IconDto): boolean => {
  if (!icon || !icon.svg_content) {
    return false;
  }
  
  // Basic SVG validation - check if it contains SVG tags
  const svgContent = icon.svg_content.toLowerCase();
  return svgContent.includes('<svg') && svgContent.includes('</svg>');
};

/**
 * Validate PunchIconsDto structure
 */
export const isValidPunchIcons = (punchIcons: PunchIconsDto): boolean => {
  try {
    const { filled, unfilled } = extractIconsFromPunchIcons(punchIcons);
    return isValidIcon(filled) && isValidIcon(unfilled);
  } catch {
    return false;
  }
};

/**
 * Create default punch icons (simple circle shapes)
 */
export const createDefaultPunchIcons = (): PunchIconsDto => {
  const filledIcon: IconDto = {
    id: 'default-filled',
    name: 'Filled Circle',
    svg_content: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>'
  };
  
  const unfilledIcon: IconDto = {
    id: 'default-unfilled',
    name: 'Empty Circle',
    svg_content: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'
  };
  
  return createPunchIcons(filledIcon, unfilledIcon);
}; 