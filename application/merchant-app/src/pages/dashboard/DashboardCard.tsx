import React from 'react';
import { EpunchCard } from '../../components/foundational';

export interface DashboardCardProps {
  children: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  children
}) => {
  return (
          <div 
        style={{
          width: '100%',
          height: '12rem',
          overflow: 'hidden',
          fontSize: '1rem'
        }}
        className="dashboard-card"
      >
      <EpunchCard>
        {children}
      </EpunchCard>
    </div>
  );
}; 