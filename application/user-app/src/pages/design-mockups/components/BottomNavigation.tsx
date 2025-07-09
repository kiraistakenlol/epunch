import React from 'react';
import { Wallet, History, User } from 'lucide-react';
import './BottomNavigation.css';

export interface BottomNavigationItem {
  id: string;
  icon: string | React.ReactNode;
  label: string;
  badge?: number | string;
  disabled?: boolean;
}

export interface BottomNavigationProps {
  items: BottomNavigationItem[];
  activeItemId?: string;
  onItemClick?: (itemId: string) => void;
  variant?: 'default' | 'minimal' | 'compact';
  className?: string;
}

const iconMap = {
  wallet: Wallet,
  history: History,
  user: User,
  account: User
};

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  activeItemId,
  onItemClick,
  variant = 'default',
  className = ''
}) => {
  const handleItemClick = (item: BottomNavigationItem) => {
    if (!item.disabled && onItemClick) {
      onItemClick(item.id);
    }
  };

  const renderIcon = (icon: string | React.ReactNode) => {
    if (typeof icon === 'string') {
      const IconComponent = iconMap[icon as keyof typeof iconMap];
      return IconComponent ? <IconComponent size={20} strokeWidth={2} /> : icon;
    }
    return icon;
  };

  return (
    <div className={`bottom-navigation bottom-navigation--${variant} ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          className={`
            bottom-navigation__item 
            ${activeItemId === item.id ? 'bottom-navigation__item--active' : ''}
            ${item.disabled ? 'bottom-navigation__item--disabled' : ''}
          `}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          aria-label={item.label}
        >
          <div className="bottom-navigation__icon">
            {renderIcon(item.icon)}
            {item.badge && (
              <span className="bottom-navigation__badge">{item.badge}</span>
            )}
          </div>
          <span className="bottom-navigation__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation; 