import React from 'react';
import styles from './PunchCardFrontHeader.module.css';

interface PunchCardFrontHeaderProps {
  shopName: string;
  status: string;
  secondaryColor: string;
}

const PunchCardFrontHeader: React.FC<PunchCardFrontHeaderProps> = ({
  shopName,
  status,
  secondaryColor
}) => {
  const rewardReadyIcon =
    <span 
      className={styles.readyIcon}
      style={{ color: secondaryColor }}
    >
      ✓
    </span>;

  return (
    <div 
      className={styles.container}
      style={{
        color: secondaryColor
      }}
    >
      <span 
        className={styles.shopName}
        style={{ color: secondaryColor }}
      >
        {shopName}
      </span>

      {status === 'REWARD_READY' && rewardReadyIcon}
    </div>
  );
};

export default PunchCardFrontHeader; 