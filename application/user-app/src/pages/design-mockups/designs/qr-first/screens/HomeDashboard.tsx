import React, { useState } from 'react';
import { ScreenProps } from '../../../types';
import { BaseScreen, PunchCard } from '../../../components';
import { Search } from 'lucide-react';
import FloatingQRButton from '../components/FloatingQRButton';
import QRCodeModal from '../components/QRCodeModal';
import AuthPrompt from '../components/AuthPrompt';
import './HomeDashboard.css';

const HomeDashboard: React.FC<ScreenProps> = ({ isActive: _isActive }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(true);

  const punchCards = [
    {
      id: '1',
      name: 'Daily Grind Coffee',
      currentPunches: 6,
      totalPunches: 8,
      subtitle: 'Buy 8, Get 1 Free'
    },
    {
      id: '2',
      name: 'Green Smoothie Co',
      currentPunches: 8,
      totalPunches: 8,
      subtitle: 'Free smoothie ready!'
    },
    {
      id: '3',
      name: 'Bella Vista Pizza',
      currentPunches: 4,
      totalPunches: 6,
      subtitle: 'Buy 6, Get 1 Free'
    },
    {
      id: '4',
      name: 'Book Corner Cafe',
      currentPunches: 3,
      totalPunches: 10,
      subtitle: 'Buy 10, Get 1 Free'
    },
    {
      id: '5',
      name: 'Sunset Bakery',
      currentPunches: 5,
      totalPunches: 7,
      subtitle: 'Buy 7, Get 1 Free'
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'punch' as const,
      shopName: 'Daily Grind Coffee',
      description: 'Punch added',
      timeAgo: '2h ago',
      initials: 'DG'
    }
  ];

  const stats = {
    totalCards: 5,
    activeCards: 3,
    rewardsReady: 1
  };

  const navItems = [
    { id: 'wallet', icon: 'wallet', label: 'Wallet' },
    { id: 'history', icon: 'history', label: 'History' },
    { id: 'account', icon: 'user', label: 'Account' }
  ];

  return (
    <BaseScreen
      headerProps={{
        title: "Wallet",
        stats: `${stats.totalCards} cards • ${stats.rewardsReady} rewards`
      }}
      bottomNavProps={{
        items: navItems,
        activeItemId: 'wallet'
      }}
      className="home-dashboard"
    >
      <AuthPrompt
        isVisible={showAuthPrompt}
        onDismiss={() => setShowAuthPrompt(false)}
        onSignIn={() => setShowAuthPrompt(false)}
      />
      <div className="search-section">
        <div className="search-input-container">
          <Search size={16} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.activeCards}</div>
          <div className="stat-label">Active Cards</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.rewardsReady}</div>
          <div className="stat-label">Rewards Ready</div>
        </div>
      </div>

      <div className="cards-section">
        <h3>Your Cards</h3>
        <div className="cards-scroll-container">
          {punchCards.map((card) => (
            <div key={card.id} className="card-item">
              <PunchCard
                totalSlots={card.totalPunches}
                punchedSlots={card.currentPunches}
                title={card.name}
                subtitle={card.subtitle}
                variant={card.currentPunches === card.totalPunches ? 'completed' : 'default'}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">{activity.initials}</div>
              <div className="activity-info">
                <div className="activity-shop">{activity.shopName}</div>
                <div className="activity-description">{activity.description}</div>
              </div>
              <div className="activity-time">{activity.timeAgo}</div>
            </div>
          ))}
        </div>
      </div>

      <FloatingQRButton 
        onClick={() => setShowQRModal(true)}
        hasRewards={stats.rewardsReady > 0}
      />

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        mode="user"
        hasRewards={stats.rewardsReady > 0}
      />
    </BaseScreen>
  );
};

export default HomeDashboard; 