import React from 'react';
import { shadows, colors, borderRadius } from '../../../theme/constants';

export interface EpunchCardProps {
  children: React.ReactNode;
}

export const EpunchCard: React.FC<EpunchCardProps> = ({
  children
}) => {
  return (
    <div
      style={{
        backgroundColor: colors.background.paper,
        borderRadius: borderRadius.medium,
        boxShadow: shadows.light,
        width: '100%',
        height: '100%',
        padding: '1rem'
      }}
    >
      {children}
    </div>
  );
}; 