import React from 'react';
import { Box, BoxProps } from '@mui/material';

export interface EpunchCenteredContainerProps extends Omit<BoxProps, 'sx'> {
  minHeight?: string | number;
  fullHeight?: boolean;
  children?: React.ReactNode;
}

export const EpunchCenteredContainer: React.FC<EpunchCenteredContainerProps> = ({
  minHeight,
  fullHeight = false,
  children,
  ...props
}) => {
  return (
    <Box 
      {...props}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: fullHeight ? '100vh' : minHeight,
        border: '2px solid darkgreen', // Debug border
        borderRadius: '4px'
      }}
    >
      {children}
    </Box>
  );
}; 