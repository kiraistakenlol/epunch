import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { BenefitCardDto } from 'e-punch-common-core';
import { appColors } from 'e-punch-common-ui';
import BaseCard from '../../../../components/BaseCard';
import BenefitCardFront from './front/BenefitCardFront';
import { setSelectedBenefitCardId, clearSelectedBenefitCard, scrollToBenefitCard, selectSelectedBenefitCardId } from '../../../benefitCards/benefitCardsSlice';
import { useAppSelector } from '../../../../store/hooks';
import { AppDispatch } from '../../../../store/store';
import styles from './BenefitCardItem.module.css';

interface BenefitAnimationFlags {
  highlighted?: boolean;
}

interface BenefitCardItemProps extends BenefitCardDto {
  interactive?: boolean;
  selectable?: boolean;
  enableAnimations?: boolean;
  
  onAction?: (action: 'select', benefitCardId: string) => void;
  
  animationFlags?: BenefitAnimationFlags;
}

const BenefitCardItem = forwardRef<HTMLDivElement, BenefitCardItemProps>(({
  id,
  itemName,
  merchant,
  expiresAt,
  styles: cardStyles,
  interactive = true,
  selectable = true,
  enableAnimations = true,
  onAction,
  animationFlags
}, forwardedRef) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const selectedBenefitCardId = useAppSelector(selectSelectedBenefitCardId);
  const isSelected = selectedBenefitCardId === id;
  
  const isHighlighted = enableAnimations && (animationFlags?.highlighted || false);

  const isExpired = Boolean(expiresAt && new Date(expiresAt) < new Date());

  const handleClick = () => {
    if (!interactive || !selectable) return;
    
    if (isExpired) return;
    
    onAction?.(isSelected ? 'select' : 'select', id);
    
    if (isSelected) {
      dispatch(clearSelectedBenefitCard());
    } else {
      if (selectedBenefitCardId) {
        dispatch(clearSelectedBenefitCard());
      }
      dispatch(setSelectedBenefitCardId(id));
      dispatch(scrollToBenefitCard(id));
    }
  };

  const getCardVisualClasses = () => {
    const classes = [];

    if (isSelected && !isExpired) {
      classes.push(styles.scaleUp);
    }

    if (isExpired) {
      classes.push(styles.expired);
    }

    if (isHighlighted) {
      classes.push(styles.scaleUpAndBackToNormalAnimation);
    }

    return classes.join(' ');
  };

  const backgroundColor = cardStyles?.primaryColor || appColors.epunchGray;
  const textColor = cardStyles?.secondaryColor || appColors.epunchBlack;

  const content = (
    <BenefitCardFront
      id={id}
      merchant={merchant}
      itemName={itemName}
      expiresAt={expiresAt}
      isExpired={isExpired}
      isAvailable={!isExpired}
      animationFlags={animationFlags}
      styles={cardStyles}
    />
  );

  return (
    <BaseCard
      ref={forwardedRef}
      front={content}
      onClick={interactive && !isExpired ? handleClick : undefined}
      className={getCardVisualClasses()}
      disableFlipping={true}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
});

BenefitCardItem.displayName = 'BenefitCardItem';

export default BenefitCardItem;