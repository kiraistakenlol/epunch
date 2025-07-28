import React from 'react';
import { CardColors } from '../../../../../../utils/cardStyles';
import styles from './PunchCardFrontHeader.module.css';

interface PunchCardFrontHeaderProps {
  shopName: string;
  status: string;
  isSelected: boolean;
  colors: CardColors;
}

const PunchCardFrontHeader: React.FC<PunchCardFrontHeaderProps> = ({
  shopName,
  status,
  isSelected,
  colors
}) => {
  const rewardReadyIcon =
    <span className={`${styles.checkIcon} ${isSelected ? styles.selected : ''}`}>
      🎁
    </span>;

  return (
    <div 
      className={styles.container}
      style={{
        backgroundColor: colors.frontHeaderBg,
        color: colors.textColor
      }}
    >
      <span 
        className={styles.shopName}
        style={{ color: colors.textColor }}
      >
        {shopName}
      </span>

      {status === 'REWARD_READY' && rewardReadyIcon}
    </div>
  );
};

export default PunchCardFrontHeader; 