import React, { useState } from 'react';
import { ScreenProps } from '../../../types';
import { BaseScreen, Card, Button } from '../../../components';
import ContextualQRModal from '../components/ContextualQRModal';
import './ProfileScreen.css';

const ProfileScreen: React.FC<ScreenProps> = ({ isActive: _isActive }) => {
  const [showQRModal, setShowQRModal] = useState(false);

  const userStats = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    memberSince: 'January 2024',
    totalPunches: 127,
    totalRewards: 8,
    favoriteShops: 5
  };

  const settingsItems = [
    { id: 'notifications', label: 'Notifications', icon: '🔔', hasToggle: true },
    { id: 'privacy', label: 'Privacy Settings', icon: '🔒', hasToggle: false },
    { id: 'language', label: 'Language', icon: '🌐', hasToggle: false },
    { id: 'feedback', label: 'Send Feedback', icon: '💬', hasToggle: false },
    { id: 'help', label: 'Help & Support', icon: '❓', hasToggle: false },
    { id: 'about', label: 'About E-Punch', icon: 'ℹ️', hasToggle: false }
  ];

  const navItems = [
    { id: 'cards', icon: '💳', label: 'Cards' },
    { id: 'rewards', icon: '🎁', label: 'Rewards' },
    { id: 'activity', icon: '📊', label: 'Activity' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  const qrButton = (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => setShowQRModal(true)}
    >
      QR
    </Button>
  );

  return (
    <BaseScreen
      className="profile-screen"
      headerProps={{
        title: "Profile",
        rightElement: qrButton
      }}
      bottomNavProps={{
        items: navItems,
        activeItemId: "profile"
      }}
    >
      <div className="profile-content">
        <Card className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-initials">
                {userStats.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{userStats.name}</h2>
              <p className="profile-email">{userStats.email}</p>
              <p className="profile-member">Member since {userStats.memberSince}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{userStats.totalPunches}</div>
              <div className="stat-label">Total Punches</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userStats.totalRewards}</div>
              <div className="stat-label">Rewards Claimed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userStats.favoriteShops}</div>
              <div className="stat-label">Favorite Shops</div>
            </div>
          </div>
        </Card>

        <div className="settings-section">
          <h3 className="section-title">Settings</h3>
          <Card className="settings-card">
            {settingsItems.map((item, index) => (
              <div key={item.id} className="setting-item">
                <div className="setting-left">
                  <span className="setting-icon">{item.icon}</span>
                  <span className="setting-label">{item.label}</span>
                </div>
                <div className="setting-right">
                  {item.hasToggle ? (
                    <div className="toggle-switch">
                      <input type="checkbox" id={item.id} defaultChecked />
                      <label htmlFor={item.id} className="toggle-label"></label>
                    </div>
                  ) : (
                    <span className="setting-arrow">›</span>
                  )}
                </div>
                {index < settingsItems.length - 1 && <div className="setting-divider"></div>}
              </div>
            ))}
          </Card>
        </div>

        <div className="account-actions">
          <Button variant="outline" className="sign-out-button">
            Sign Out
          </Button>
        </div>
      </div>

      {showQRModal && (
        <ContextualQRModal 
          onClose={() => setShowQRModal(false)}
          mode="user"
        />
      )}
    </BaseScreen>
  );
};

export default ProfileScreen; 