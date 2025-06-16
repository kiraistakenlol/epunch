import React from 'react';
import { Container, ContainerProps } from '@mui/material';

export interface EpunchContainerProps extends Omit<ContainerProps, 'sx'> {
  size?: 'small' | 'medium' | 'large';
  centered?: boolean;
}

export const EpunchContainer: React.FC<EpunchContainerProps> = ({
  size = 'medium',
  centered = false,
  children,
  ...props
}) => {
  const getMaxWidth = () => {
    switch (size) {
      case 'small': return 'sm';
      case 'medium': return 'md';
      case 'large': return 'lg';
      default: return 'md';
    }
  };

  return (
    <Container 
      maxWidth={getMaxWidth()}
      {...props}
      sx={{
        ...(centered && {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }),
        border: '2px solid cyan',
        borderRadius: '8px'
      }}
    >
      {children}
    </Container>
  );
}; 