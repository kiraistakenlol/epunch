import { forwardRef } from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { CustomizableCardStyles } from '../../../../utils/cardStyles';
import BaseCard from '../../../../components/BaseCard';
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

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(id);
    }
  };

  // Visual state logic for punch-card specific styling
  const getCardVisualClasses = () => {
    const classes = [];

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
        resolvedStyles={resolvedStyles}
        animatedPunchIndex={animatedPunchIndex}
        isSelected={isSelected}
      />
      {status === 'REWARD_READY' && animatedPunchIndex === undefined && !hideCompletionOverlay && (
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
      resolvedStyles={resolvedStyles}
    />
  );

  return (
    <BaseCard
      ref={forwardedRef}
      front={frontContent}
      back={backContent}
      onClick={handleClick}
      className={getCardVisualClasses()}
      disableFlipping={disableFlipping}
    />
  );
});

export default PunchCardItem; 