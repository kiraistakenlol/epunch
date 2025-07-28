import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { PunchCardDto } from 'e-punch-common-core';
import BaseCard from '../../../../components/BaseCard';
import PunchCardFront from './front/PunchCardFront';
import PunchCardBack from './back/PunchCardBack';
import PunchCardOverlay from './ready-overlay/PunchCardOverlay';
import { setSelectedCardId, clearSelectedCard, scrollToCard, selectSelectedCardId } from '../../../punchCards/punchCardsSlice';
import { useAppSelector } from '../../../../store/hooks';
import { AppDispatch } from '../../../../store/store';
import styles from './PunchCardItem.module.css';

interface PunchCardItemProps extends PunchCardDto {
  // Behavioral flags - no context awareness
  interactive?: boolean;
  selectable?: boolean;
  flippable?: boolean;
  showCompletionOverlay?: boolean;
  enableAnimations?: boolean;
  showShadow?: boolean;
  
  // External overrides for special cases
  onAction?: (action: 'select' | 'redeem', cardId: string) => void;
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
  // Behavioral props with defaults
  interactive = true,
  selectable = true,
  flippable = true,
  showCompletionOverlay = true,
  enableAnimations = true,
  showShadow = true,
  onAction,
  ...rest
}, forwardedRef) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Read selection state from Redux (external state that QRCode depends on)
  const selectedCardId = useAppSelector(selectSelectedCardId);
  const isSelected = selectedCardId === id;
  

  
  // Internal animation state - access animationFlags from rest props
  const animationFlags = (rest as any).animationFlags;
  const isHighlighted = enableAnimations && (animationFlags?.highlighted || false);
  const animatedPunchIndex = enableAnimations ? animationFlags?.punchAnimation?.punchIndex : undefined;

  const handleClick = () => {
    if (!interactive || !selectable) return;
    
    // Only allow selection of REWARD_READY cards (original behavior)
    if (status !== 'REWARD_READY') return;
    
    onAction?.(isSelected ? 'select' : 'select', id);
    
    // Redux actions for external state management
    if (isSelected) {
      dispatch(clearSelectedCard());
    } else {
      if (selectedCardId) {
        dispatch(clearSelectedCard());
      }
      dispatch(setSelectedCardId(id));
      dispatch(scrollToCard(id));
    }
  };



  // Visual state logic for punch-card specific styling
  const getCardVisualClasses = () => {
    const classes = [];

    // Only apply shadow classes if showShadow is true
    if (showShadow) {
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

    return classes.join(' ');
  };

  const frontContent = (
    <>
      <PunchCardFront
        loyaltyProgramId={loyaltyProgramId}
        shopName={shopName}
        currentPunches={currentPunches}
        totalPunches={totalPunches}
        status={status}
        cardStyles={cardStyles}
        animatedPunchIndex={animatedPunchIndex}
      />
      {status === 'REWARD_READY' && animatedPunchIndex === undefined && showCompletionOverlay && (
        <PunchCardOverlay
          cardId={id}
        />
      )}
    </>
  );

  const backContent = (
          <PunchCardBack
        loyaltyProgramId={loyaltyProgramId}
        shopName={shopName}
        shopAddress={shopAddress}
        totalPunches={totalPunches}
        cardStyles={cardStyles}
      />
  );

  return (
    <BaseCard
      ref={forwardedRef}
      front={frontContent}
      back={backContent}
      onClick={interactive ? handleClick : undefined}
      className={getCardVisualClasses()}
      disableFlipping={!flippable}
    />
  );
});

export default PunchCardItem; 