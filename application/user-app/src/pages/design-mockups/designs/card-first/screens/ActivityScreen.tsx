import React, { useState } from 'react';
import { ScreenProps } from '../../../types';
import { BaseScreen, Card, FilterChips } from '../../../components';
import './ActivityScreen.css';

const ActivityScreen: React.FC<ScreenProps> = ({ isActive: _isActive }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const activityData = [
    {
      id: '1',
      type: 'punch',
      shopName: 'Daily Grind Coffee',
      shopEmoji: '☕',
      description: 'Earned 1 punch',
      timeAgo: '2 hours ago',
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'reward',
      shopName: 'Green Smoothie Co',
      shopEmoji: '🥤',
      description: 'Claimed free smoothie',
      timeAgo: '1 day ago',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'punch',
      shopName: 'Bella Vista Pizza',
      shopEmoji: '🍕',
      description: 'Earned 1 punch',
      timeAgo: '2 days ago',
      date: '2024-01-13'
    },
    {
      id: '4',
      type: 'milestone',
      shopName: 'Book Corner Cafe',
      shopEmoji: '📚',
      description: 'Reached 50 total punches',
      timeAgo: '3 days ago',
      date: '2024-01-12'
    },
    {
      id: '5',
      type: 'punch',
      shopName: 'Sunset Bakery',
      shopEmoji: '🥐',
      description: 'Earned 1 punch',
      timeAgo: '4 days ago',
      date: '2024-01-11'
    },
    {
      id: '6',
      type: 'reward',
      shopName: 'Book Corner Cafe',
      shopEmoji: '📚',
      description: 'Claimed free latte',
      timeAgo: '5 days ago',
      date: '2024-01-10'
    }
  ];

  const statsData = {
    totalPunches: 127,
    totalRewards: 8,
    activeCards: 5,
    thisWeekPunches: 12
  };

  const filterChips = [
    { id: 'all', label: 'All Activity' },
    { id: 'punch', label: 'Punches' },
    { id: 'reward', label: 'Rewards' },
    { id: 'milestone', label: 'Milestones' }
  ];

  const navItems = [
    { id: 'cards', icon: '💳', label: 'Cards' },
    { id: 'rewards', icon: '🎁', label: 'Rewards' },
    { id: 'activity', icon: '📊', label: 'Activity' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  const filteredActivity = activityData.filter(item => 
    activeFilter === 'all' || item.type === activeFilter
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'punch': return '⭐';
      case 'reward': return '🎁';
      case 'milestone': return '🏆';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'punch': return 'active';
      case 'reward': return 'reward';
      case 'milestone': return 'default';
      default: return 'default';
    }
  };

  return (
    <BaseScreen
      className="activity-screen"
      headerProps={{
        title: "Activity",
        stats: `${statsData.totalPunches} total punches`
      }}
      bottomNavProps={{
        items: navItems,
        activeItemId: "activity"
      }}
    >
      <div className="activity-content">
        <div className="stats-section">
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-number">{statsData.totalPunches}</div>
              <div className="stat-label">Total Punches</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-number">{statsData.totalRewards}</div>
              <div className="stat-label">Rewards Claimed</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-number">{statsData.activeCards}</div>
              <div className="stat-label">Active Cards</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-number">{statsData.thisWeekPunches}</div>
              <div className="stat-label">This Week</div>
            </Card>
          </div>
        </div>

        <div className="filter-section">
          <FilterChips 
            chips={filterChips}
            activeChipId={activeFilter}
            onChipClick={setActiveFilter}
          />
        </div>

        <div className="activity-timeline">
          {filteredActivity.map((item) => (
            <Card 
              key={item.id} 
              className={`activity-item ${getActivityColor(item.type)}`}
            >
              <div className="activity-header">
                <div className="activity-left">
                  <div className="activity-icon">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="activity-shop">
                    <span className="shop-emoji">{item.shopEmoji}</span>
                    <span className="shop-name">{item.shopName}</span>
                  </div>
                </div>
                <div className="activity-time">
                  {item.timeAgo}
                </div>
              </div>
              <div className="activity-description">
                {item.description}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </BaseScreen>
  );
};

export default ActivityScreen; 