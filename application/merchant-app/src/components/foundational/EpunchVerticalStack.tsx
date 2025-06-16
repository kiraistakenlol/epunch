import React from 'react';
import { Box } from '@mui/material';

export interface EpunchVerticalStackProps {
  /** Children to stack vertically */
  children: React.ReactNode;
  /** Spacing between items */
  spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  /** Alignment of items */
  align?: 'stretch' | 'start' | 'center' | 'end';
  /** Whether to fill full height */
  fullHeight?: boolean;
  /** Custom spacing in pixels (overrides spacing prop) */
  customSpacing?: number;
}

export const EpunchVerticalStack: React.FC<EpunchVerticalStackProps> = ({
  children,
  spacing = 'medium',
  align = 'stretch',
  fullHeight = false,
  customSpacing
}) => {
  const getSpacing = () => {
    if (customSpacing !== undefined) return customSpacing;
    
    switch (spacing) {
      case 'none':
        return 0;
      case 'small':
        return 1;
      case 'large':
        return 3;
      case 'xlarge':
        return 4;
      default:
        return 2;
    }
  };

  const getAlignment = () => {
    switch (align) {
      case 'start':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'end':
        return 'flex-end';
      default:
        return 'stretch';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: getAlignment(),
        gap: getSpacing(),
        ...(fullHeight && { height: '100%' }),
        ...(align === 'stretch' && { width: '100%' })
      }}
    >
      {children}
    </Box>
  );
}; 