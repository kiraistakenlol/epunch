import React from 'react';
import { AppHeader } from '../';
import BottomNavigation, { BottomNavigationItem } from '../BottomNavigation';
import { AppHeaderProps, BottomNavProps } from '../../types';
import './BaseScreen.css';

interface BaseScreenProps {
  children: React.ReactNode;
  headerProps?: AppHeaderProps;
  bottomNavProps?: BottomNavProps & {
    onItemClick?: (itemId: string) => void;
    variant?: 'default' | 'minimal' | 'compact';
  };
  className?: string;
}

const BaseScreen: React.FC<BaseScreenProps> = ({ 
  children, 
  headerProps, 
  bottomNavProps, 
  className = '' 
}) => {
  // Convert old NavItem[] to new BottomNavigationItem[]
  const adaptedItems: BottomNavigationItem[] = bottomNavProps?.items.map(item => ({
    id: item.id,
    icon: item.icon,
    label: item.label,
    disabled: false
  })) || [];

  return (
    <div className={`base-screen ${className}`}>
      {headerProps && <AppHeader {...headerProps} />}
      
      <div className="screen-content">
        {children}
      </div>
      
      {bottomNavProps && (
        <BottomNavigation
          items={adaptedItems}
          activeItemId={bottomNavProps.activeItemId}
          onItemClick={bottomNavProps.onItemClick}
          variant={bottomNavProps.variant || 'default'}
          className=""
        />
      )}
    </div>
  );
};

export default BaseScreen; 