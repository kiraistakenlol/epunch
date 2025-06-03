import React from 'react';
import styles from './PunchCardFrontHeader.module.css';

interface PunchCardFrontHeaderProps {
  shopName: string;
  status: string;
}

const PunchCardFrontHeader: React.FC<PunchCardFrontHeaderProps> = ({ 
  shopName, 
  status 
}) => (
  <>
    <div className={styles.headerLeft}>
      <span className={styles.shopName}>{shopName}</span>
    </div>
    <div className={styles.headerRight}>
      {status === 'REWARD_READY' && <span className={styles.checkIcon}>🎁</span>}
    </div>
  </>
);

export default PunchCardFrontHeader; 