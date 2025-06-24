import React, { useRef, useState, forwardRef } from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { CustomizableCardStyles } from '../../../../utils/cardStyles';
import PunchCardFront from './front/PunchCardFront';
import PunchCardBack from './back/PunchCardBack';
import PunchCardOverlay from './ready-overlay/PunchCardOverlay';
import styles from './PunchCardItem.module.css';

interface PunchCardItemProps extends PunchCardDto {
  resolvedStyles: CustomizableCardStyles;
  isHighlighted?: boolean;
  animatedPunchIndex?: number;
  isSelected?: boolean;
  onCardClick?: (cardId: string) => void;
  onRedemptionClick?: (cardId: string) => void;
  hideCompletionOverlay?: boolean;
  disableFlipping?: boolean;
  hideShadow?: boolean;
}

const PunchCardItem = forwardRef<HTMLDivElement, PunchCardItemProps>(({
  id,
  loyaltyProgramId,
  shopName,
  shopAddress,
  currentPunches,
  totalPunches,
  status,
  resolvedStyles,
  isHighlighted = false,
  animatedPunchIndex,
  isSelected = false,
  onCardClick,
  hideCompletionOverlay = false,
  disableFlipping = false,
  hideShadow = false
}, forwardedRef) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const cardRef = forwardedRef || internalRef;
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Check if there are any ongoing animations

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (onCardClick) {
      onCardClick(id);
    }

    if (!disableFlipping && !isFlipping) {
      const newFlippedState = !isFlipped;

      setIsFlipping(true);

      setTimeout(() => {
        setIsFlipped(newFlippedState);
      }, 300);

      setTimeout(() => {
        setIsFlipping(false);
      }, 700);
    }
  };

  // Visual state logic
  const getCardVisualClasses = () => {
    const classes = [styles.cardInner];

    // Only apply shadow classes if hideShadow is false
    if (!hideShadow) {
      // Shadow priority: selected > reward ready > active > base
      if (isSelected) {
        classes.push(styles.shadowGold, styles.scaleUp);
      } else if (status === 'REWARD_READY') {
        classes.push(styles.shadowGreen);
      } else {
        classes.push(styles.shadowBlack);
      }
    } else if (isSelected) {
      // Still apply scaleUp for selected state even without shadow
      classes.push(styles.scaleUp);
    }

    // Animation states
    if (isHighlighted) {
      classes.push(styles.scaleUpAndBackToNormalAnimation);
    }

    if (isFlipping) {
      classes.push(styles.flipAnimation);
    }

    return classes.join(' ');
  };

  return (
    <div
      ref={cardRef}
      className={styles.punchCardItemContainer}
      onClick={handleClick}
    >
      <div className={getCardVisualClasses()}>
        {!isFlipped ? (
          <PunchCardFront
            loyaltyProgramId={loyaltyProgramId}
            shopName={shopName}
            currentPunches={currentPunches}
            totalPunches={totalPunches}
            status={status}
            resolvedStyles={resolvedStyles}
            animatedPunchIndex={animatedPunchIndex}
            isSelected={isSelected}
          />
        ) : (
          <PunchCardBack
            loyaltyProgramId={loyaltyProgramId}
            shopName={shopName}
            shopAddress={shopAddress}
            totalPunches={totalPunches}
            resolvedStyles={resolvedStyles}
          />
        )}

        {!isFlipped && status === 'REWARD_READY' && animatedPunchIndex === undefined && !hideCompletionOverlay && (
          <PunchCardOverlay
            cardId={id}
          />
        )}
      </div>
    </div>
  );
});

export default PunchCardItem; 