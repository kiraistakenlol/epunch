import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useAppDispatch } from '../../../../store/hooks';
import { handleEvent } from '../../../animations/animationSlice';
import PunchCardFront from './front/PunchCardFront';
import PunchCardBack from './back/PunchCardBack';
import PunchCardOverlay from './ready-overlay/PunchCardOverlay';
import styles from './PunchCardItem.module.css';

interface PunchCardItemProps extends PunchCardDto {
  isHighlighted?: boolean;
  animatedPunchIndex?: number;
  shouldSlideIn?: boolean;
  shouldSlideRight?: boolean;
  isSelected?: boolean;
  onCardClick?: (cardId: string) => void;
  onRedemptionClick?: (cardId: string) => void;
  animateRewardClaimed?: boolean;
}

const PunchCardItem = forwardRef<HTMLDivElement, PunchCardItemProps>(({
  id,
  loyaltyProgramId,
  shopName,
  shopAddress,
  currentPunches,
  totalPunches,
  status,
  styles: cardStyles,
  isHighlighted = false,
  animatedPunchIndex,
  shouldSlideIn = false,
  shouldSlideRight = false,
  isSelected = false,
  onCardClick,
  onRedemptionClick,
  animateRewardClaimed
}, forwardedRef) => {
  const dispatch = useAppDispatch();
  const internalRef = useRef<HTMLDivElement>(null);
  const cardRef = forwardedRef || internalRef;
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Listen for CSS animation events
  useEffect(() => {
    const cardElement = typeof cardRef === 'function' ? null : cardRef?.current;
    if (!cardElement) return;

    const handleAnimationEnd = (e: AnimationEvent) => {
      if (e.animationName.includes('newPunchAnimation')) {
        dispatch(handleEvent('PUNCH_ANIMATION_COMPLETE'));
      } else if (e.animationName.includes('highlightReward')) {
        dispatch(handleEvent('HIGHLIGHT_ANIMATION_COMPLETE'));
      } else if (e.animationName.includes('slideInFromLeft')) {
        dispatch(handleEvent('SLIDE_IN_ANIMATION_COMPLETE'));
      } else if (e.animationName.includes('slideOutAndFade')) {
        dispatch(handleEvent('SLIDE_OUT_ANIMATION_COMPLETE'));
      } else if (e.animationName.includes('cardFlip')) {
        setIsAnimating(false);
      }
    };

    cardElement.addEventListener('animationend', handleAnimationEnd, true);

    return () => {
      cardElement.removeEventListener('animationend', handleAnimationEnd, true);
    };
  }, [id, dispatch, cardRef]);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (onCardClick) {
      onCardClick(id);
    }

    if (!isAnimating) {
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

  const handleRedemptionClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (onRedemptionClick) {
      onRedemptionClick(id);
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
            styles={cardStyles}
            animatedPunchIndex={animatedPunchIndex}
            isSelected={isSelected}
          />
        ) : (
          <PunchCardBack
            loyaltyProgramId={loyaltyProgramId}
            shopName={shopName}
            shopAddress={shopAddress}
            totalPunches={totalPunches}
            styles={cardStyles}
          />
        )}

        {!isFlipped && status === 'REWARD_READY' && (
          <PunchCardOverlay
            isSelected={isSelected}
            onClick={isSelected ? undefined : handleRedemptionClick}
          />
        )}
      </div>

    </div>
  );
});

export default PunchCardItem; 