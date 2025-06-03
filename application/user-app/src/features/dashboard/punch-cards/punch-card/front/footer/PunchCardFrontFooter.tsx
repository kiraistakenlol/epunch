import React from 'react';
import styles from './PunchCardFrontFooter.module.css';

interface PunchCardFrontFooterProps {
  status: string;
  isSelected: boolean;
  onRedemptionClick?: (event: React.MouseEvent) => void;
}

const PunchCardFrontFooter: React.FC<PunchCardFrontFooterProps> = ({
  status,
  isSelected,
  onRedemptionClick
}) => (
  <div className={styles.container}>
    {status === 'REWARD_READY' && !isSelected ? (
      <span 
        className={styles.redemptionClickableText}
        onClick={onRedemptionClick}
      >
        TAP TO REDEEM
      </span>
    ) : ''}
  </div>
);

export default PunchCardFrontFooter; 