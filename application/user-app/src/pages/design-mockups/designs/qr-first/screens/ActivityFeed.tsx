import React, { useState } from 'react';
import { ScreenProps } from '../../../types';
import { BaseScreen, FilterChips, Card } from '../../../components';
import { Wallet, History, User, ArrowUpRight, Calendar } from 'lucide-react';
import FloatingQRButton from '../components/FloatingQRButton';
import QRCodeModal from '../components/QRCodeModal';
import './ActivityFeed.css';

const ActivityFeed: React.FC<ScreenProps> = ({ isActive }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showQRModal, setShowQRModal] = useState(false);

  const activities = [
    {
      id: '1',
      type: 'punch' as const,
      shopName: 'Daily Grind Coffee',
      description: 'Punch added • 6/8 complete',
      timeAgo: '2 hours ago',
      initials: 'DG'
    },
    {
      id: '2',
      type: 'reward' as const,
      shopName: 'Green Smoothie Co',
      description: 'Reward earned • Ready to claim',
      timeAgo: '1 day ago',
      initials: 'GS'
    },
    {
      id: '3',
      type: 'punch' as const,
      shopName: 'Bella Vista Pizza',
      description: 'Punch added • 4/6 complete',
      timeAgo: '3 days ago',
      initials: 'BV'
    },
    {
      id: '4',
      type: 'milestone' as const,
      shopName: 'Book Corner Cafe',
      description: 'Halfway milestone reached • 5/10 complete',
      timeAgo: '1 week ago',
      initials: 'BC'
    }
  ];

  const filterChips = [
    { id: 'all', label: 'All Activity' },
    { id: 'punch', label: 'Punches' },
    { id: 'reward', label: 'Rewards' },
    { id: 'milestone', label: 'Milestones' }
  ];

  const filteredActivities = activeFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === activeFilter);

  const stats = {
    thisWeek: 4,
    thisMonth: 12,
    totalRewards: 8
  };

  const navItems = [
    { id: 'wallet', icon: 'wallet', label: 'Wallet' },
    { id: 'history', icon: 'history', label: 'History' },
    { id: 'account', icon: 'user', label: 'Account' }
  ];

    return (
    <BaseScreen
      headerProps={{
        title: "History",
        stats: `${stats.thisWeek} this week • ${stats.totalRewards} total rewards`
      }}
      bottomNavProps={{
        items: navItems,
        activeItemId: 'history'
      }}
      className="activity-feed"
    >
      <div className="activity-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.thisWeek}</div>
            <div className="stat-label">This Week</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.thisMonth}</div>
            <div className="stat-label">This Month</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalRewards}</div>
            <div className="stat-label">Total Rewards</div>
          </div>
        </div>
      </div>

      <div className="activity-filters">
        <FilterChips 
          chips={filterChips}
          activeChipId={activeFilter}
          onChipClick={setActiveFilter}
        />
      </div>

      <div className="activity-timeline scrollable-content">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="activity-card">
            <div className="activity-item">
              <div className="activity-icon">{activity.initials}</div>
              <div className="activity-content">
                <div className="activity-shop">{activity.shopName}</div>
                <div className="activity-description">{activity.description}</div>
                <div className="activity-time">{activity.timeAgo}</div>
              </div>
              <div className={`activity-type ${activity.type}`}>
                {activity.type === 'punch' && <ArrowUpRight size={16} strokeWidth={2} />}
                {activity.type === 'reward' && <ArrowUpRight size={16} strokeWidth={2} />}
                {activity.type === 'milestone' && <Calendar size={16} strokeWidth={2} />}
              </div>
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

export default ActivityFeed; 