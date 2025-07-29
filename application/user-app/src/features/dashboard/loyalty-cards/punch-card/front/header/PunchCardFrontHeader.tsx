import React from 'react';
import styles from './PunchCardFrontHeader.module.css';

interface PunchCardFrontHeaderProps {
  shopName: string;
  status: string;
}

const PunchCardFrontHeader: React.FC<PunchCardFrontHeaderProps> = ({
  shopName,
  status
}) => {
  const rewardReadyIcon =
    <span className={styles.readyIcon}>
      ✓
    </span>;

  return (
    <div className={styles.container}>
      <span className={styles.shopName}>
        {shopName}
      </span>

      {status === 'REWARD_READY' && rewardReadyIcon}
    </div>
  );
};

export default PunchCardFrontHeader; 