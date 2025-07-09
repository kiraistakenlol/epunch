import React from 'react';
import { Wallet, History, User } from 'lucide-react';
import './NavItem.css';

interface NavItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const iconMap = {
  wallet: Wallet,
  history: History,
  user: User
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive = false, onClick }) => {
  const IconComponent = iconMap[icon as keyof typeof iconMap];
  
  return (
    <div 
      className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
      onClick={onClick}
    >
      <div className="nav-icon">
        {IconComponent ? <IconComponent size={20} strokeWidth={2} /> : icon}
      </div>
      <span className="nav-label">{label}</span>
    </div>
  );
};

export default NavItem; 