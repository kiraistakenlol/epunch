import React, { useState } from 'react';
import { ScreenProps } from '../../../types';
import { BaseScreen, Button, Card } from '../../../components';
import { Wallet, History, User, Settings, LogOut, Bell, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import FloatingQRButton from '../components/FloatingQRButton';
import QRCodeModal from '../components/QRCodeModal';
import './RewardsManagement.css';

const RewardsManagement: React.FC<ScreenProps> = ({ isActive }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const accountOptions = [
    {
      id: 'notifications',
      icon: <Bell size={20} strokeWidth={2} />,
      label: 'Notifications',
      description: 'Manage notification preferences'
    },
    {
      id: 'privacy',
      icon: <Shield size={20} strokeWidth={2} />,
      label: 'Privacy & Security',
      description: 'Control your data and privacy settings'
    },
    {
      id: 'help',
      icon: <HelpCircle size={20} strokeWidth={2} />,
      label: 'Help & Support',
      description: 'Get help and contact support'
    },
    {
      id: 'settings',
      icon: <Settings size={20} strokeWidth={2} />,
      label: 'Settings',
      description: 'App preferences and configuration'
    }
  ];

  const stats = {
    totalCards: 5,
    totalRewards: 8,
    joinedDate: 'March 2024'
  };

  const navItems = [
    { id: 'wallet', icon: 'wallet', label: 'Wallet' },
    { id: 'history', icon: 'history', label: 'History' },
    { id: 'account', icon: 'user', label: 'Account' }
  ];

    return (
    <BaseScreen
      headerProps={{
        title: "Account",
        stats: `${stats.totalCards} cards • ${stats.totalRewards} rewards • Joined ${stats.joinedDate}`
      }}
      bottomNavProps={{
        items: navItems,
        activeItemId: 'account'
      }}
      className="rewards-management"
    >
      {!isSignedIn ? (
        <div className="auth-section">
          <div className="auth-card">
            <div className="auth-icon">
              <User size={32} strokeWidth={2} />
            </div>
            <h3>Sign in to save your progress</h3>
            <p>Keep your punch cards and rewards synced across all devices</p>
            <div className="auth-buttons">
              <Button onClick={() => setIsSignedIn(true)} className="sign-in-button">
                Sign In
              </Button>
              <Button variant="outline" onClick={() => setIsSignedIn(true)} className="sign-up-button">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-icon">
              <User size={32} strokeWidth={2} />
            </div>
            <h3>John Doe</h3>
            <p>john.doe@email.com</p>
            <Button variant="outline" onClick={() => setIsSignedIn(false)} className="sign-out-button">
              <LogOut size={16} strokeWidth={2} />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      <div className="account-options scrollable-content">
        {accountOptions.map((option) => (
          <Card key={option.id} className="option-card">
            <div className="option-content">
              <div className="option-icon">{option.icon}</div>
              <div className="option-info">
                <div className="option-label">{option.label}</div>
                <div className="option-description">{option.description}</div>
              </div>
              <ChevronRight size={20} strokeWidth={2} className="option-arrow" />
            </div>
          </Card>
        ))}
      </div>

      <FloatingQRButton 
        onClick={() => setShowQRModal(true)}
        hasRewards={false}
      />

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        mode="user"
        hasRewards={false}
      />
    </BaseScreen>
  );
};

export default RewardsManagement; 