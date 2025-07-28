import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { BundleDto } from 'e-punch-common-core';
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
  // Behavioral flags - no context awareness
  interactive?: boolean;
  selectable?: boolean;
  enableAnimations?: boolean;
  showShadow?: boolean;
  
  // External overrides for special cases
  onAction?: (action: 'select' | 'use', bundleId: string) => void;
  
  // Animation flags (passed through rest props)
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
  // Behavioral props with defaults
  interactive = true,
  selectable = true,
  enableAnimations = true,
  showShadow = true,
  onAction,
  animationFlags
}, forwardedRef) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Read selection state from Redux (external state that QRCode depends on)
  const selectedBundleId = useAppSelector(selectSelectedBundleId);
  const isSelected = selectedBundleId === id;
  

  
  // Internal animation state
  const isHighlighted = enableAnimations && (animationFlags?.highlighted || false);

  // Bundle availability logic
  const isExpired = Boolean(expiresAt && new Date(expiresAt) < new Date());
  const isUsedUp = remainingQuantity === 0;

  const handleClick = () => {
    if (!interactive || !selectable) return;
    
    // Don't allow selection of expired bundles
    if (isExpired) return;
    
    onAction?.(isSelected ? 'select' : 'select', id);
    
    // Redux actions for external state management - same as punch cards
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

  // Visual state logic for bundle-specific styling - like punch cards
  const getCardVisualClasses = () => {
    const classes = [];

    // Only apply shadow classes if showShadow is true
    if (showShadow) {
      if (isExpired) {
        // Expired bundles get grey shadow and are not selectable
        classes.push(styles.shadowGray);
      } else if (isSelected) {
        // Selected bundles get gold shadow
        classes.push(styles.shadowGold, styles.scaleUp);
      } else {
        // Default green shadow for available bundles
        classes.push(styles.shadowGreen);
      }
    } else if (isSelected && !isExpired) {
      // Still apply scaleUp for selected state even without shadow (but not if expired)
      classes.push(styles.scaleUp);
    }

    // Greyed out appearance for expired bundles
    if (isExpired) {
      classes.push(styles.expired);
    }

    // Animation states
    if (isHighlighted) {
      classes.push(styles.scaleUpAndBackToNormalAnimation);
    }

    return classes.join(' ');
  };

  const content = (
    <BundleCardFront
      merchant={merchant}
      itemName={itemName}
      remainingQuantity={remainingQuantity}
      originalQuantity={originalQuantity}
      expiresAt={expiresAt}
      isExpired={isExpired}
      isUsedUp={isUsedUp}
      isAvailable={!isExpired && !isUsedUp}
      cardStyles={cardStyles}
    />
  );

  return (
    <BaseCard
      ref={forwardedRef}
      front={content}
      onClick={interactive && !isExpired ? handleClick : undefined}
      className={getCardVisualClasses()}
      disableFlipping={true}
    />
  );
});

BundleCardItem.displayName = 'BundleCardItem';

export default BundleCardItem; 