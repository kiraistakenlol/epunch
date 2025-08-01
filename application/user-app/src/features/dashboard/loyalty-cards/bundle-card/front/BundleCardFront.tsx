import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { MerchantDto } from 'e-punch-common-core';
import { clearAnimationFlags } from '../../../../../features/bundles/bundlesSlice';
import { AppDispatch } from '../../../../../store/store';
import styles from './BundleCardFront.module.css';
import layoutStyles from '../../punch-card/shared/PunchCardLayout.module.css';

interface BundleAnimationFlags {
  highlighted?: boolean;
  quantityAnimation?: { newQuantity: number };
}

interface BundleCardFrontProps {
  id: string;
  merchant: MerchantDto;
  itemName: string;
  remainingQuantity: number;
  originalQuantity: number;
  expiresAt: string | null;
  isExpired: boolean;
  isUsedUp: boolean;
  isAvailable: boolean;
  animationFlags?: BundleAnimationFlags;
  styles?: {
    primaryColor: string | null;
    secondaryColor: string | null;
    logoUrl: string | null;
    punchIcons: any;
  };
}

const BundleCardFront: React.FC<BundleCardFrontProps> = ({
  id,
  merchant,
  itemName,
  remainingQuantity,
  originalQuantity,
  expiresAt,
  animationFlags,
  styles: cardStyles
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const getDaysUntilExpiration = () => {
    if (!expiresAt) return { text: null, days: null };
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Expired', days: diffDays };
    if (diffDays === 0) return { text: 'Expires today', days: 0 };
    if (diffDays === 1) return { text: 'Expires in 1 day', days: 1 };
    return { text: `${diffDays} day(s) left`, days: diffDays };
  };

  const expiration = getDaysUntilExpiration();
  
  const isQuantityAnimated = Boolean(animationFlags?.quantityAnimation);
  const animatedQuantity = animationFlags?.quantityAnimation?.newQuantity ?? remainingQuantity;
  
  // Get the actual text color for animation (fallback to black if not available)
  const textColor = cardStyles?.secondaryColor || '#000000';
  
  // Clear animation flags after animation completes
  useEffect(() => {
    if (isQuantityAnimated) {
      const timeout = setTimeout(() => {
        dispatch(clearAnimationFlags(id));
      }, 1200); // Match the animation duration

      return () => clearTimeout(timeout);
    }
  }, [isQuantityAnimated, dispatch, id]);

  return (
    <div 
      className={`${layoutStyles.defaultCardLayout} ${styles.frontSide}`}
    >
      <div className={`${layoutStyles.cardSection}`}>
        <div className={styles.headerSection}>
          <span className={styles.merchantName}>
            {merchant.name}
          </span>
        </div>
      </div>
      
      <div className={`${layoutStyles.cardSection}`}>
        <div className={styles.mainContent}>
          <div className={styles.quantity}>
            <motion.span 
              className={styles.remainingQuantity}
              animate={isQuantityAnimated ? {
                scale: [1, 1.3, 1],
                color: [textColor, '#FFD700', textColor]
              } : {}}
              transition={isQuantityAnimated ? {
                duration: 1.2,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              } : {}}

            >
              {animatedQuantity}
            </motion.span>
            <span className={styles.separator}>/</span>
            <span className={styles.totalQuantity}>{originalQuantity}</span>
          </div>
          <div className={styles.itemName}>
            {itemName}
          </div>
        </div>
      </div>

      <div className={`${layoutStyles.cardSection}`}>
        <div className={styles.footerSection}>
          {expiration.text && (
            <div className={styles.expiration}>
              {expiration.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BundleCardFront; 