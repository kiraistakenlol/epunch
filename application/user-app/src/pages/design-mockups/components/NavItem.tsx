import React from 'react';
import './NavItem.css';

interface NavItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive = false, onClick }) => {
  return (
    <div 
      className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
      onClick={onClick}
    >
      <div className="nav-icon">{icon}</div>
      <span className="nav-label">{label}</span>
    </div>
  );
};

export default NavItem; 