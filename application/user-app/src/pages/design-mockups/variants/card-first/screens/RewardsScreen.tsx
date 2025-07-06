import React from 'react';
import BaseScreen from './BaseScreen';
import { Card, Button } from '../../../components';
import { ScreenProps, RewardData } from '../../../types';
import './RewardsScreen.css';

const RewardsScreen: React.FC<ScreenProps> = () => {
  const rewards: RewardData[] = [
    {
      id: '1',
      shopName: 'Pottery Cafe',
      shopEmoji: '☕',
      rewardText: 'Free Coffee',
      expiryText: 'Expires in 7 days'
    },
    {
      id: '2',
      shopName: 'Green Smoothie',
      shopEmoji: '🥤',
      rewardText: 'Free Smoothie',
      expiryText: 'Expires in 5 days'
    }
  ];

  const rewardHistory = [
    {
      id: '1',
      shopName: 'Pizza Corner',
      shopEmoji: '🍕',
      rewardText: 'Free Pizza Slice',
      redeemedDate: '2 days ago'
    },
    {
      id: '2',
      shopName: 'Book Nook',
      shopEmoji: '📚',
      rewardText: '20% Discount',
      redeemedDate: '1 week ago'
    }
  ];

  return (
    <BaseScreen
      headerTitle="Rewards"
      headerStats={`${rewards.length} ready to claim`}
      activeNavItemId="rewards"
    >
      <div className="rewards-screen">
        <div className="ready-rewards">
          <h3 className="section-title">🎁 Ready to Claim</h3>
          {rewards.map((reward) => (
            <Card key={reward.id} variant="reward" className="reward-card">
              <div className="reward-header">
                <div className="reward-shop">
                  <span className="reward-emoji">{reward.shopEmoji}</span>
                  <div className="reward-info">
                    <h4 className="reward-shop-name">{reward.shopName}</h4>
                    <p className="reward-text">{reward.rewardText}</p>
                  </div>
                </div>
                <Button variant="success" size="sm">
                  Redeem
                </Button>
              </div>
              {reward.expiryText && (
                <p className="reward-expiry">{reward.expiryText}</p>
              )}
            </Card>
          ))}
        </div>

        <div className="reward-history">
          <h3 className="section-title">📜 Recent Redemptions</h3>
          {rewardHistory.map((reward) => (
            <div key={reward.id} className="history-item">
              <div className="history-shop">
                <span className="history-emoji">{reward.shopEmoji}</span>
                <div className="history-info">
                  <h4 className="history-shop-name">{reward.shopName}</h4>
                  <p className="history-reward-text">{reward.rewardText}</p>
                </div>
              </div>
              <span className="history-date">{reward.redeemedDate}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseScreen>
  );
};

export default RewardsScreen; 