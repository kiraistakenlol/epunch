import React from 'react';
import { BottomNavProps } from '../types';
import NavItem from './NavItem';
import './BottomNav.css';

const BottomNav: React.FC<BottomNavProps> = ({ items, activeItemId }) => {
  return (
    <div className="bottom-nav">
      {items.map((item) => (
        <NavItem 
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={item.id === activeItemId}
        />
      ))}
    </div>
  );
};

export default BottomNav; 