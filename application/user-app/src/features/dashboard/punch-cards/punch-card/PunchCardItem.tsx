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
  shouldSlideIn?: boolean;
  shouldSlideRight?: boolean;
  isSelected?: boolean;
  onCardClick?: (cardId: string) => void;
  onRedemptionClick?: (cardId: string) => void;
  animateRewardClaimed?: boolean;
  showLastFilledPunchAsNotFilled?: boolean;
  hideCompletionOverlay?: boolean;
  disableFlipping?: boolean;
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
  shouldSlideIn = false,
  shouldSlideRight = false,
  isSelected = false,
  onCardClick,
  animateRewardClaimed,
  showLastFilledPunchAsNotFilled,
  hideCompletionOverlay = false,
  disableFlipping = false
}, forwardedRef) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const cardRef = forwardedRef || internalRef;
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Check if there are any ongoing animations

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (onCardClick) {
      onCardClick(id);
    }

    if (!disableFlipping && !isAnimating) {
      const newFlippedState = !isFlipped;

      setIsAnimating(true);

      setTimeout(() => {
        setIsFlipped(newFlippedState);
      }, 300);

      // Failsafe: reset isAnimating after animation duration + buffer
      setTimeout(() => {
        setIsAnimating(false);
      }, 700); // 600ms animation + 100ms buffer
    }
  };

  const cardClasses = [
    styles.punchCardItemContainer,
    styles[`status${status}`],
    isHighlighted ? styles.highlighted : '',
    shouldSlideIn ? styles.punchCardSlideIn : '',
    shouldSlideRight ? styles.punchCardSlideRight : '',
    isSelected ? styles.selectedForRedemption : '',
    status === 'REWARD_READY' ? styles.clickableCard : styles.flippableCard,
    animateRewardClaimed ? styles.punchCardSlideOut : '',
    isAnimating ? styles.flipping : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      onClick={handleClick}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className={styles.cardInner}>
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
            showLastFilledPunchAsNotFilled={showLastFilledPunchAsNotFilled}
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