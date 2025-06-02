import React, { useEffect, useRef, useState } from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectLoyaltyProgramById } from '../loyaltyPrograms/loyaltyProgramsSlice';
import { handleEvent } from '../animations/animationSlice';
import styles from './PunchCardItem.module.css';

interface PunchCardItemProps extends PunchCardDto {
  isHighlighted?: boolean;
  animatedPunchIndex?: number;
  shouldSlideIn?: boolean;
  shouldSlideRight?: boolean;
  isSelected?: boolean;
  onCardClick?: (cardId: string) => void;
  animateRewardClaimed?: boolean;
}

const CheckCircleIcon = () => (
  <svg className={styles.checkIcon} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
  </svg>
);

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
  animateRewardClaimed
}) => {
  const loyaltyProgram = useAppSelector(state => selectLoyaltyProgramById(state, loyaltyProgramId));
  const dispatch = useAppDispatch();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Create punch circles
  const punchCircles: JSX.Element[] = [];
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
    
    if (onCardClick) {
      onCardClick(id);
    }

    if (status !== 'REWARD_READY' && !isAnimating) {
      const newFlippedState = !isFlipped;
      
      setIsAnimating(true);
      
      // Switch content at 50% of animation (300ms)
      setTimeout(() => {
        setIsFlipped(newFlippedState);
      }, 300);
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

  const renderFrontSide = () => (
    <div className={styles.cardFront}>
      <div className={styles.punchCardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.shopName}>{shopName}</span>
        </div>
        <div className={styles.headerRight}>
          {status === 'REWARD_READY' && <CheckCircleIcon />}
        </div>
      </div>
      <div className={styles.punchCardBody}>
        <div className={styles.punchCirclesContainer}>
          {punchCircles}
        </div>
        {loyaltyProgram && (
          <div className={styles.loyaltyProgramName}>{loyaltyProgram.name}</div>
        )}
        <div className={styles.rewardReadyLabel}>
          {status === 'REWARD_READY' && !isSelected ? 'Tap to redeem reward!' : ''}
        </div>
      </div>
      <div className={styles.punchCardFooter}>
      </div>
    </div>
  );

  const renderBackSide = () => (
    <div className={styles.cardBack}>
      <div className={styles.backHeader}>
        <span className={styles.backHeaderTitle}>Details</span>
      </div>
      <div className={styles.backContent}>
        <div className={styles.infoSection}>
          <div className={styles.infoLabel}>Merchant</div>
          <div className={styles.infoValue}>{shopName}</div>
        </div>
        
        {shopAddress && (
          <div className={styles.infoSection}>
            <div className={styles.infoLabel}>Address</div>
            <div className={styles.infoValue}>{shopAddress}</div>
          </div>
        )}
        
        {loyaltyProgram && (
          <>
            <div className={styles.infoSection}>
              <div className={styles.infoLabel}>Program</div>
              <div className={styles.infoValue}>{loyaltyProgram.name}</div>
            </div>
            
            {loyaltyProgram.description && (
              <div className={styles.infoSection}>
                <div className={styles.infoLabel}>Description</div>
                <div className={styles.infoValue}>{loyaltyProgram.description}</div>
              </div>
            )}
            
            <div className={styles.infoSection}>
              <div className={styles.infoLabel}>Reward</div>
              <div className={styles.infoValue}>{loyaltyProgram.rewardDescription}</div>
            </div>
          </>
        )}
        
        <div className={styles.infoSection}>
          <div className={styles.infoLabel}>Progress</div>
          <div className={styles.infoValue}>{currentPunches} / {totalPunches} punches</div>
        </div>
      </div>
      <div className={styles.backFooter}>
        <span className={styles.tapToFlipHint}>Tap to flip back</span>
      </div>
    </div>
  );

  return (
    <div 
      ref={cardRef}
      className={cardClasses}
      onClick={handleClick}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className={styles.cardInner}>
        {!isFlipped ? renderFrontSide() : renderBackSide()}
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