import React, { useEffect, useRef, useState } from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useAppDispatch } from '../../../../store/hooks';
import { handleEvent } from '../../../animations/animationSlice';
import PunchCardFront from './front/PunchCardFront';
import PunchCardBack from './back/PunchCardBack';
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

const PunchCardItem: React.FC<PunchCardItemProps> = ({
  id,
  loyaltyProgramId,
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
  onCardClick,
  onRedemptionClick,
  animateRewardClaimed
}) => {
  const dispatch = useAppDispatch();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Listen for CSS animation events
  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const handleAnimationEnd = (e: AnimationEvent) => {
      console.log('Animation ended:', e.animationName, 'on card:', id, 'target:', e.target);
      
      if (e.animationName.includes('newPunchAnimation')) {
        console.log('→ Dispatching PUNCH_ANIMATION_COMPLETE');
        dispatch(handleEvent('PUNCH_ANIMATION_COMPLETE'));
      } else if (e.animationName.includes('highlightReward')) {
        console.log('→ Dispatching HIGHLIGHT_ANIMATION_COMPLETE');
        dispatch(handleEvent('HIGHLIGHT_ANIMATION_COMPLETE'));
      } else if (e.animationName.includes('slideInFromLeft')) {
        console.log('→ Dispatching SLIDE_IN_ANIMATION_COMPLETE');
        dispatch(handleEvent('SLIDE_IN_ANIMATION_COMPLETE'));
      } else if (e.animationName.includes('slideOutAndFade')) {
        console.log('→ Dispatching SLIDE_OUT_ANIMATION_COMPLETE for reward claimed');
        dispatch(handleEvent('SLIDE_OUT_ANIMATION_COMPLETE'));
      } else if (e.animationName.includes('cardFlip')) {
        console.log('→ Flip animation complete');
        setIsAnimating(false);
      } else {
        console.log('→ Unhandled animation name:', e.animationName);
      }
    };

    cardElement.addEventListener('animationend', handleAnimationEnd, true);
    
    return () => {
      cardElement.removeEventListener('animationend', handleAnimationEnd, true);
    };
  }, [id, dispatch]);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (isSelected) {
      if (onCardClick) {
        onCardClick(id);
      }
      return;
    }
    
    if (onCardClick) {
      onCardClick(id);
    }
    
    if (!isAnimating) {
      const newFlippedState = !isFlipped;
      
      setIsAnimating(true);
      
      setTimeout(() => {
        setIsFlipped(newFlippedState);
      }, 300);
    }
  };

  const handleRedemptionClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (onRedemptionClick) {
      onRedemptionClick(id);
    }
  };

  const cardClasses = [
    styles.punchCardItem,
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
            animatedPunchIndex={animatedPunchIndex}
            isSelected={isSelected}
            onRedemptionClick={handleRedemptionClick}
          />
        ) : (
          <PunchCardBack
            loyaltyProgramId={loyaltyProgramId}
            shopName={shopName}
            shopAddress={shopAddress}
            totalPunches={totalPunches}
          />
        )}
      </div>
      {isSelected && (
        <div className={styles.redemptionOverlay}>
          <span className={styles.redemptionLabel}>
            Selected
          </span>
        </div>
      )}
    </div>
  );
};

export default PunchCardItem; 