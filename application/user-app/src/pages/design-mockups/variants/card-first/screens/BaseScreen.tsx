import React from 'react';
import { AppHeader, BottomNav } from '../../../components';
import { ScreenProps, NavItem } from '../../../types';
import './BaseScreen.css';

interface BaseScreenProps extends ScreenProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerStats?: string;
  headerLeftElement?: React.ReactNode;
  headerRightElement?: React.ReactNode;
  bottomNavItems?: NavItem[];
  activeNavItemId?: string;
}

const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
  headerTitle,
  headerStats,
  headerLeftElement,
  headerRightElement,
  bottomNavItems,
  activeNavItemId,
}) => {
  const defaultNavItems: NavItem[] = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'cards', icon: '🃏', label: 'Cards' },
    { id: 'rewards', icon: '🎁', label: 'Rewards' },
    { id: 'activity', icon: '📊', label: 'Activity' },
  ];

  return (
    <div className="base-screen">
      <AppHeader
        title={headerTitle}
        stats={headerStats}
        leftElement={headerLeftElement}
        rightElement={headerRightElement}
      />
      <div className="screen-content">
        {children}
      </div>
      <BottomNav
        items={bottomNavItems || defaultNavItems}
        activeItemId={activeNavItemId}
      />
    </div>
  );
};

export default BaseScreen; 