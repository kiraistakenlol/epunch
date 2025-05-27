import React from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import styles from './DashboardPage.module.css';

interface PunchCardItemProps extends PunchCardDto {
  isHighlighted?: boolean;
  animatedPunchIndex?: number;
  shouldSlideIn?: boolean;
  shouldSlideRight?: boolean;
  isSelected?: boolean;
  onCardClick?: (cardId: string) => void;
}

const LocationPinIcon = () => (
  <svg className={styles.locationIcon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className={styles.checkIcon} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
  </svg>
);

const PunchCardItem: React.FC<PunchCardItemProps> = ({
  id,
  shopName,
  shopAddress,
  currentPunches,
  totalPunches,
  status,
  isHighlighted = false,
  animatedPunchIndex,
  shouldSlideIn = false,
  shouldSlideRight = false,
  isSelected = false,
  onCardClick
}) => {
  const punchCircles = [];
  for (let i = 0; i < totalPunches; i++) {
    const isFilled = i < currentPunches;
    const isAnimated = animatedPunchIndex === i;
    punchCircles.push(
      <div
        key={i}
        className={`${styles.punchCircle} ${isFilled ? styles.punchCircleFilled : ''} ${isAnimated ? styles.punchCircleAnimated : ''}`}
      ></div>
    );
  }

  const handleClick = () => {
    if (status === 'REWARD_READY' && onCardClick) {
      onCardClick(id);
    }
  };

  const cardClasses = [
    styles.punchCardItem,
    styles[`status${status}`],
    isHighlighted ? styles.highlighted : '',
    shouldSlideIn ? styles.punchCardSlideIn : '',
    shouldSlideRight ? styles.punchCardSlideRight : '',
    isSelected ? styles.selectedForRedemption : '',
    status === 'REWARD_READY' ? styles.clickableCard : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={handleClick}
      style={{ cursor: status === 'REWARD_READY' ? 'pointer' : 'default', position: 'relative' }}
    >
      <div className={styles.punchCardHeader}>
        <div className={styles.headerLeft}>
          <LocationPinIcon />
          {shopAddress}
        </div>
        <div className={styles.headerRight}>
          {status === 'REWARD_READY' && <CheckCircleIcon />}
        </div>
      </div>
      <div className={styles.punchCardBody}>
        <div className={styles.punchCirclesContainer}>
          {punchCircles}
        </div>
      </div>
      <div className={styles.punchCardFooter}>
        <span className={styles.shopName}>{shopName}</span>
      </div>
      {isSelected && (
        <div className={styles.redemptionOverlay}>
          <span className={styles.redemptionLabel}>
            Selected for Redemption
          </span>
        </div>
      )}
    </div>
  );
};

export default PunchCardItem; 