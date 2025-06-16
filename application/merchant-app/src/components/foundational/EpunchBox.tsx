import React from 'react';
import { Box, BoxProps } from '@mui/material';

export interface EpunchBoxProps extends BoxProps {
  children?: React.ReactNode;
}

export const EpunchBox: React.FC<EpunchBoxProps> = ({
  children,
  ...props
}) => {
  return (
    <Box {...props} sx={{...props.sx, border: '2px solid red', borderRadius: '4px'}}>
      {children}
    </Box>
  );
}; 