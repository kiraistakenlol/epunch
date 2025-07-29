import { forwardRef } from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { appColors } from 'e-punch-common-ui';
import BaseCard from '../../../../components/BaseCard';
import PunchCardFront from './front/PunchCardFront';
import PunchCardBack from './back/PunchCardBack';
import PunchCardOverlay from './ready-overlay/PunchCardOverlay';
import { selectSelectedCardId } from '../../../punchCards/punchCardsSlice';
import { useAppSelector } from '../../../../store/hooks';
import styles from './PunchCardItem.module.css';

interface PunchCardItemProps extends PunchCardDto {
  interactive?: boolean;
  selectable?: boolean;
  flippable?: boolean;
  showCompletionOverlay?: boolean;
  enableAnimations?: boolean;
  
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
  interactive = true,
  selectable = true,
  flippable = true,
  showCompletionOverlay = true,
  enableAnimations = true,
  onAction,
  ...rest
}, forwardedRef) => {
  const selectedCardId = useAppSelector(selectSelectedCardId);
  const isSelected = selectedCardId === id;
  
  const animationFlags = (rest as any).animationFlags;
  const isHighlighted = enableAnimations && (animationFlags?.highlighted || false);
  const animatedPunchIndex = enableAnimations ? animationFlags?.punchAnimation?.punchIndex : undefined;

  const handleClick = () => {
    if (!interactive || !selectable) return;
    
    if (status === 'REWARD_READY') return;
    
  };

  const getCardVisualClasses = () => {
    const classes = [];

    if (isSelected) {
      classes.push(styles.scaleUp);
    }

    if (isHighlighted) {
      classes.push(styles.scaleUpAndBackToNormalAnimation);
    }

    return classes.join(' ');
  };

  const backgroundColor = cardStyles?.primaryColor || appColors.epunchGray;
  const textColor = cardStyles?.secondaryColor || appColors.epunchBlack;

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
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
});

export default PunchCardItem; 