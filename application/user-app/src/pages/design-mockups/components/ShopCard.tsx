import React from 'react';
import { Card, ProgressBar, Button } from './';
import { ShopCardData } from '../types';
import './ShopCard.css';

interface ShopCardProps {
  data: ShopCardData;
  onClick?: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ data, onClick }) => {
  const isRewardReady = data.status === 'reward_ready';
  const variant = isRewardReady ? 'reward' : 'default';

  return (
    <Card variant={variant} className="shop-card" onClick={onClick}>
      <div className="shop-card-header">
        <div className="shop-info">
          <span className="shop-emoji">{data.emoji}</span>
          <div className="shop-details">
            <h4 className="shop-name">{data.name}</h4>
            {data.location && (
              <p className="shop-location">{data.location}</p>
            )}
          </div>
        </div>
        {isRewardReady && (
          <Button variant="success" size="sm">
            Claim
          </Button>
        )}
      </div>
      
      <div className="shop-card-body">
        <ProgressBar
          current={data.currentPunches}
          total={data.totalPunches}
        />
        {data.motivationText && (
          <p className="motivation-text">{data.motivationText}</p>
        )}
      </div>
    </Card>
  );
};

export default ShopCard; 