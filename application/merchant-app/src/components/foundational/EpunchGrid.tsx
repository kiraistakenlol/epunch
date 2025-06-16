import React from 'react';
import { Grid, GridProps } from '@mui/material';

export interface EpunchGridProps extends Omit<GridProps, 'sx'> {
  variant?: 'container' | 'item';
  spacing?: 'small' | 'medium' | 'large';
  responsive?: boolean;
}

export const EpunchGrid: React.FC<EpunchGridProps> = ({
  variant = 'item',
  spacing = 'medium',
  responsive = true,
  children,
  ...props
}) => {
  const getSpacing = () => {
    switch (spacing) {
      case 'small': return 1;
      case 'medium': return 2;
      case 'large': return 3;
      default: return 2;
    }
  };

  const getMobileSpacing = () => {
    switch (spacing) {
      case 'small': return 1;
      case 'medium': return 2;
      case 'large': return 2;
      default: return 2;
    }
  };

  if (variant === 'container') {
    return (
      <Grid 
        container 
        spacing={responsive ? { xs: getMobileSpacing(), sm: getSpacing() } : getSpacing()}
        {...props}
        sx={{border: '2px dashed magenta', padding: '4px'}}
      >
        {children}
      </Grid>
    );
  }

  return (
    <Grid {...props} sx={{border: '1px solid pink', margin: '2px'}}>
      {children}
    </Grid>
  );
}; 