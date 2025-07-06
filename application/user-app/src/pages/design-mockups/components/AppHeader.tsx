import React from 'react';
import { AppHeaderProps } from '../types';
import './AppHeader.css';

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  leftElement, 
  rightElement, 
  stats 
}) => {
  return (
    <div className="app-header">
      <div className="header-left">
        {leftElement}
      </div>
      <div className="header-center">
        {title && <div className="app-title">{title}</div>}
        {stats && <div className="header-stats">{stats}</div>}
      </div>
      <div className="header-right">
        {rightElement}
      </div>
    </div>
  );
};

export default AppHeader; 