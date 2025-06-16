import React from 'react';
import { EpunchGrid } from './EpunchGrid';
import { useMobile } from '../../hooks/useMobile';

interface EpunchSmartGridProps {
  children: React.ReactNode;
}

export const EpunchSmartGrid: React.FC<EpunchSmartGridProps> = ({ 
  children
}) => {
  const isMobile = useMobile();
  const spacing = isMobile ? 'small' : 'medium';

  return (
    <EpunchGrid variant="container" spacing={spacing}>
      {React.Children.map(children, (child, index) => (
        <EpunchGrid 
          key={index}
          size={{ xs: 12, sm: 6, md: 4 }}
        >
          {child}
        </EpunchGrid>
      ))}
    </EpunchGrid>
  );
}; 