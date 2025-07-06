import React from 'react';
import BaseScreen from './BaseScreen';
import { Button } from '../../../components';
import { ScreenProps, ShopCardData } from '../../../types';
import ShopCard from '../../../components/ShopCard';
import './DashboardScreen.css';

const DashboardScreen: React.FC<ScreenProps> = () => {
  const rewardReadyCards: ShopCardData[] = [
    {
      id: '1',
      name: 'Pottery Cafe',
      emoji: '☕',
      currentPunches: 10,
      totalPunches: 10,
      status: 'reward_ready',
      motivationText: 'Reward Ready!'
    },
    {
      id: '2',
      name: 'Green Smoothie',
      emoji: '🥤',
      currentPunches: 5,
      totalPunches: 5,
      status: 'reward_ready',
      motivationText: 'Free smoothie awaits!'
    }
  ];

  const activeCards: ShopCardData[] = [
    {
      id: '3',
      name: 'Pizza Corner',
      emoji: '🍕',
      currentPunches: 7,
      totalPunches: 10,
      status: 'active',
      motivationText: '3 more for free pizza!'
    },
    {
      id: '4',
      name: 'Book Nook',
      emoji: '📚',
      currentPunches: 3,
      totalPunches: 8,
      status: 'active',
      motivationText: '5 more for 20% off'
    },
    {
      id: '5',
      name: 'Gym Plus',
      emoji: '💪',
      currentPunches: 2,
      totalPunches: 12,
      status: 'active',
      motivationText: '10 more for free session'
    },
    {
      id: '6',
      name: 'Hair Studio',
      emoji: '💇',
      currentPunches: 1,
      totalPunches: 6,
      status: 'active',
      motivationText: '5 more for free wash'
    }
  ];

  return (
    <BaseScreen
      headerTitle="My Cards"
      headerStats="8 active • 2 rewards ready"
      headerRightElement={<Button variant="outline" size="sm">QR</Button>}
      activeNavItemId="home"
    >
      <div className="dashboard-screen">
        {rewardReadyCards.length > 0 && (
          <div className="reward-section">
            <h3 className="section-title">🎁 Ready to Claim</h3>
            <div className="reward-cards">
              {rewardReadyCards.map((card) => (
                <ShopCard key={card.id} data={card} />
              ))}
            </div>
          </div>
        )}
        
        <div className="active-section">
          <h3 className="section-title">🔥 Keep Going</h3>
          <div className="active-cards-grid">
            {activeCards.map((card) => (
              <ShopCard key={card.id} data={card} />
            ))}
          </div>
        </div>
      </div>
    </BaseScreen>
  );
};

export default DashboardScreen; 