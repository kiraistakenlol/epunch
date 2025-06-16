import React from 'react';
import { Box, BoxProps } from '@mui/material';

export interface EpunchFlexRowProps extends Omit<BoxProps, 'sx'> {
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'space-between';
  gap?: number | string;
  wrap?: boolean;
  children?: React.ReactNode;
}

export const EpunchFlexRow: React.FC<EpunchFlexRowProps> = ({
  align = 'center',
  justify = 'start',
  gap = 0,
  wrap = false,
  children,
  ...props
}) => {
  const getAlignItems = () => {
    switch (align) {
      case 'start': return 'flex-start';
      case 'center': return 'center';
      case 'end': return 'flex-end';
      default: return 'center';
    }
  };

  const getJustifyContent = () => {
    switch (justify) {
      case 'start': return 'flex-start';
      case 'center': return 'center';
      case 'end': return 'flex-end';
      case 'space-between': return 'space-between';
      default: return 'flex-start';
    }
  };

  return (
    <Box 
      {...props}
      sx={{
        display: 'flex',
        alignItems: getAlignItems(),
        justifyContent: getJustifyContent(),
        gap: gap,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        border: '2px solid purple', // Debug border
        borderRadius: '4px'
      }}
    >
      {children}
    </Box>
  );
}; 