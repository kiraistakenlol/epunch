import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { BundleDto } from 'e-punch-common-core';
import { appColors } from 'e-punch-common-ui';
import BaseCard from '../../../../components/BaseCard';
import BundleCardFront from './front/BundleCardFront';
import { setSelectedBundleId, clearSelectedBundle, scrollToBundle, selectSelectedBundleId } from '../../../bundles/bundlesSlice';
import { useAppSelector } from '../../../../store/hooks';
import { AppDispatch } from '../../../../store/store';
import styles from './BundleCardItem.module.css';

interface BundleAnimationFlags {
  highlighted?: boolean;
  quantityAnimation?: { newQuantity: number };
}

interface BundleCardItemProps extends BundleDto {
  interactive?: boolean;
  selectable?: boolean;
  enableAnimations?: boolean;
  
  onAction?: (action: 'select' | 'use', bundleId: string) => void;
  
  animationFlags?: BundleAnimationFlags;
}

const BundleCardItem = forwardRef<HTMLDivElement, BundleCardItemProps>(({
  id,
  itemName,
  merchant,
  originalQuantity,
  remainingQuantity,
  expiresAt,
  styles: cardStyles,
  interactive = true,
  selectable = true,
  enableAnimations = true,
  onAction,
  animationFlags
}, forwardedRef) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const selectedBundleId = useAppSelector(selectSelectedBundleId);
  const isSelected = selectedBundleId === id;
  
  const isHighlighted = enableAnimations && (animationFlags?.highlighted || false);

  const isExpired = Boolean(expiresAt && new Date(expiresAt) < new Date());
  const isUsedUp = remainingQuantity === 0;

  const handleClick = () => {
    if (!interactive || !selectable) return;
    
    if (isExpired) return;
    
    onAction?.(isSelected ? 'select' : 'select', id);
    
    if (isSelected) {
      dispatch(clearSelectedBundle());
    } else {
      if (selectedBundleId) {
        dispatch(clearSelectedBundle());
      }
      dispatch(setSelectedBundleId(id));
      dispatch(scrollToBundle(id));
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
    <BundleCardFront
      id={id}
      merchant={merchant}
      itemName={itemName}
      remainingQuantity={remainingQuantity}
      originalQuantity={originalQuantity}
      expiresAt={expiresAt}
      isExpired={isExpired}
      isUsedUp={isUsedUp}
      isAvailable={!isExpired && !isUsedUp}
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

BundleCardItem.displayName = 'BundleCardItem';

export default BundleCardItem; 