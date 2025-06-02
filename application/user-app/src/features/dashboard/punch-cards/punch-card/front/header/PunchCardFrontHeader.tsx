import React from 'react';
import styles from './PunchCardFrontHeader.module.css';

interface PunchCardFrontHeaderProps {
  shopName: string;
  status: string;
}

const CheckCircleIcon = () => (
  <svg className={styles.checkIcon} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
  </svg>
);

const PunchCardFrontHeader: React.FC<PunchCardFrontHeaderProps> = ({ 
  shopName, 
  status 
}) => (
  <>
    <div className={styles.headerLeft}>
      <span className={styles.shopName}>{shopName}</span>
    </div>
    <div className={styles.headerRight}>
      {status === 'REWARD_READY' && <CheckCircleIcon />}
    </div>
  </>
);

export default PunchCardFrontHeader; 