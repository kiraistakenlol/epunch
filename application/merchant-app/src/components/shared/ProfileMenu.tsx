import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutMerchant } from '../../store/authSlice';
import './ProfileMenu.css';

export const ProfileMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logoutMerchant());
    setIsMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div 
      className="profile-menu-container" 
      ref={menuRef}
      onClick={handleMenuToggle}
      role="button"
      tabIndex={0}
      aria-label="account of current user"
      aria-expanded={isMenuOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleMenuToggle();
        }
      }}
    >
      <FaUserCircle className="profile-icon" />
      
      {user && (
        <span className="user-role">{user.role}</span>
      )}
      
      {isMenuOpen && (
        <div className="profile-menu-dropdown">
          <button className="menu-item" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}; 