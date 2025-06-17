import { PunchCardStyleDto } from 'e-punch-common-core';
import { isValidPunchIcons } from './iconTransform';

/**
 * Validate hex color format
 */
export const isValidHexColor = (color: string): boolean => {
  if (!color) return false;
  
  // Check for valid hex color format (#000000 or #000)
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate image URL (basic check for common image extensions)
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowercaseUrl = url.toLowerCase();
  
  return imageExtensions.some(ext => lowercaseUrl.includes(ext));
};

/**
 * Validate punch card style data
 */
export const validatePunchCardStyle = (style: PunchCardStyleDto): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validate colors
  if (style.primaryColor && !isValidHexColor(style.primaryColor)) {
    errors.push('Primary color must be a valid hex color (e.g., #FF0000)');
  }

  if (style.secondaryColor && !isValidHexColor(style.secondaryColor)) {
    errors.push('Secondary color must be a valid hex color (e.g., #00FF00)');
  }

  // Validate URLs
  if (style.logoUrl && !isValidImageUrl(style.logoUrl)) {
    errors.push('Logo URL must be a valid image URL');
  }

  if (style.backgroundImageUrl && !isValidImageUrl(style.backgroundImageUrl)) {
    errors.push('Background image URL must be a valid image URL');
  }

  // Validate punch icons
  if (style.punchIcons) {
    try {
      const punchIcons = JSON.parse(style.punchIcons);
      if (!isValidPunchIcons(punchIcons)) {
        errors.push('Punch icons data is invalid or corrupted');
      }
    } catch {
      errors.push('Punch icons data is not valid JSON');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create a safe default style
 */
export const createDefaultStyle = (): PunchCardStyleDto => {
  return {
    primaryColor: '#5d4037',
    secondaryColor: '#795548',
    logoUrl: null,
    backgroundImageUrl: null,
    punchIcons: null
  };
};

/**
 * Sanitize style data - remove invalid values and set defaults
 */
export const sanitizeStyle = (style: Partial<PunchCardStyleDto>): PunchCardStyleDto => {
  const sanitized: PunchCardStyleDto = createDefaultStyle();

  // Sanitize colors
  if (style.primaryColor && isValidHexColor(style.primaryColor)) {
    sanitized.primaryColor = style.primaryColor;
  }

  if (style.secondaryColor && isValidHexColor(style.secondaryColor)) {
    sanitized.secondaryColor = style.secondaryColor;
  }

  // Sanitize URLs
  if (style.logoUrl && isValidImageUrl(style.logoUrl)) {
    sanitized.logoUrl = style.logoUrl;
  }

  if (style.backgroundImageUrl && isValidImageUrl(style.backgroundImageUrl)) {
    sanitized.backgroundImageUrl = style.backgroundImageUrl;
  }

  // Sanitize punch icons
  if (style.punchIcons) {
    try {
      const punchIcons = JSON.parse(style.punchIcons);
      if (isValidPunchIcons(punchIcons)) {
        sanitized.punchIcons = style.punchIcons;
      }
    } catch {
      // Keep null if invalid
    }
  }

  return sanitized;
};

/**
 * Check if style has been customized from defaults
 */
export const isStyleCustomized = (style: PunchCardStyleDto): boolean => {
  const defaultStyle = createDefaultStyle();
  
  return (
    style.primaryColor !== defaultStyle.primaryColor ||
    style.secondaryColor !== defaultStyle.secondaryColor ||
    style.logoUrl !== null ||
    style.backgroundImageUrl !== null ||
    style.punchIcons !== null
  );
}; 