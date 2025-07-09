import React, { useState } from 'react';
import { ScreenProps } from '../../../types';
import { BaseScreen, Card, Button, ProgressBar } from '../../../components';
import ContextualQRModal from '../components/ContextualQRModal';
import './RewardsScreen.css';

const RewardsScreen: React.FC<ScreenProps> = ({ isActive }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const rewardsData = [
    {
      id: '1',
      shopName: 'Green Smoothie Co',
      shopEmoji: '🥤',
      rewardText: 'Free Large Smoothie',
      status: 'ready',
      currentPunches: 8,
      totalPunches: 8,
      expiryText: 'Expires in 7 days'
    },
    {
      id: '2',
      shopName: 'Daily Grind Coffee',
      shopEmoji: '☕',
      rewardText: 'Free Coffee',
      status: 'almost',
      currentPunches: 6,
      totalPunches: 8,
      expiryText: '2 more punches needed'
    },
    {
      id: '3',
      shopName: 'Bella Vista Pizza',
      shopEmoji: '🍕',
      rewardText: 'Free Personal Pizza',
      status: 'almost',
      currentPunches: 4,
      totalPunches: 6,
      expiryText: '2 more punches needed'
    }
  ];

  const completedRewards = [
    {
      id: '4',
      shopName: 'Book Corner Cafe',
      shopEmoji: '📚',
      rewardText: 'Free Latte',
      claimedDate: '2 days ago'
    },
    {
      id: '5',
      shopName: 'Sunset Bakery',
      shopEmoji: '🥐',
      rewardText: 'Free Croissant',
      claimedDate: '1 week ago'
    }
  ];

  const navItems = [
    { id: 'cards', icon: '💳', label: 'Cards' },
    { id: 'rewards', icon: '🎁', label: 'Rewards' },
    { id: 'activity', icon: '📊', label: 'Activity' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  const handleClaimReward = (rewardId: string, shopName: string) => {
    setSelectedReward(shopName);
    setShowQRModal(true);
  };

  const readyRewards = rewardsData.filter(r => r.status === 'ready');
  const almostRewards = rewardsData.filter(r => r.status === 'almost');

  return (
    <BaseScreen
      className="rewards-screen"
      headerProps={{
        title: "Rewards",
        stats: `${readyRewards.length} ready to claim`
      }}
      bottomNavProps={{
        items: navItems,
        activeItemId: "rewards"
      }}
    >
      <div className="rewards-content">
        {readyRewards.length > 0 && (
          <div className="rewards-section">
            <h3 className="section-title">Ready to Claim</h3>
            <div className="rewards-grid">
              {readyRewards.map((reward) => (
                <Card key={reward.id} variant="reward" className="reward-card">
                  <div className="reward-header">
                    <span className="reward-emoji">{reward.shopEmoji}</span>
                    <div className="reward-info">
                      <h4 className="reward-shop">{reward.shopName}</h4>
                      <p className="reward-text">{reward.rewardText}</p>
                    </div>
                  </div>
                  <div className="reward-progress">
                    <ProgressBar
                      current={reward.currentPunches}
                      total={reward.totalPunches}
                    />
                  </div>
                  <div className="reward-actions">
                    <Button
                      variant="success"
                      onClick={() => handleClaimReward(reward.id, reward.shopName)}
                    >
                      Claim Reward
                    </Button>
                    <small className="reward-expiry">{reward.expiryText}</small>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {almostRewards.length > 0 && (
          <div className="rewards-section">
            <h3 className="section-title">Almost There</h3>
            <div className="rewards-grid">
              {almostRewards.map((reward) => (
                <Card key={reward.id} className="reward-card">
                  <div className="reward-header">
                    <span className="reward-emoji">{reward.shopEmoji}</span>
                    <div className="reward-info">
                      <h4 className="reward-shop">{reward.shopName}</h4>
                      <p className="reward-text">{reward.rewardText}</p>
                    </div>
                  </div>
                  <div className="reward-progress">
                    <ProgressBar
                      current={reward.currentPunches}
                      total={reward.totalPunches}
                    />
                  </div>
                  <div className="reward-actions">
                    <small className="reward-expiry">{reward.expiryText}</small>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {completedRewards.length > 0 && (
          <div className="rewards-section">
            <h3 className="section-title">Recently Claimed</h3>
            <div className="rewards-grid">
              {completedRewards.map((reward) => (
                <Card key={reward.id} className="reward-card completed">
                  <div className="reward-header">
                    <span className="reward-emoji">{reward.shopEmoji}</span>
                    <div className="reward-info">
                      <h4 className="reward-shop">{reward.shopName}</h4>
                      <p className="reward-text">{reward.rewardText}</p>
                    </div>
                  </div>
                  <div className="reward-actions">
                    <small className="reward-claimed">Claimed {reward.claimedDate}</small>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {showQRModal && (
        <ContextualQRModal
          onClose={() => setShowQRModal(false)}
          mode="reward"
          shopName={selectedReward || ''}
        />
      )}
    </BaseScreen>
  );
};

export default RewardsScreen; 