import React from 'react';
import { MerchantDto, PunchCardStyleDto } from 'e-punch-common-core';
import { appColors } from 'e-punch-common-ui';
import styles from './BundleCardFront.module.css';
import layoutStyles from '../../punch-card/shared/PunchCardLayout.module.css';

interface BundleCardFrontProps {
  merchant: MerchantDto;
  itemName: string;
  remainingQuantity: number;
  originalQuantity: number;
  expiresAt: string | null;
  isExpired: boolean;
  isUsedUp: boolean;
  isAvailable: boolean;
  cardStyles: PunchCardStyleDto;
}

const BundleCardFront: React.FC<BundleCardFrontProps> = ({
  merchant,
  itemName,
  remainingQuantity,
  originalQuantity,
  expiresAt,
  cardStyles
}) => {
  const primaryColor = cardStyles?.primaryColor || appColors.epunchGray;
  const secondaryColor = cardStyles?.secondaryColor || appColors.epunchBlack;
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

  return (
    <div 
      className={`${layoutStyles.defaultCardLayout} ${styles.frontSide}`}
      style={{
        backgroundColor: primaryColor
      }}
    >
      <div className={`${layoutStyles.cardSection}`}>
        <div 
          className={styles.headerSection}
          style={{
            color: secondaryColor
          }}
        >
          <span 
            className={styles.merchantName}
            style={{ color: secondaryColor }}
          >
            {merchant.name}
          </span>
        </div>
      </div>
      
      <div className={`${layoutStyles.cardSection}`}>
        <div className={styles.mainContent}>
          <div 
            className={styles.quantity}
            style={{ color: secondaryColor }}
          >
            <span className={styles.remainingQuantity}>{remainingQuantity}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.totalQuantity}>{originalQuantity}</span>
          </div>
          <div 
            className={styles.itemName}
            style={{ color: secondaryColor }}
          >
            {itemName}
          </div>
        </div>
      </div>

      <div className={`${layoutStyles.cardSection}`}>
        <div className={styles.footerSection}>
          {expiration.text && (
            <div 
              className={styles.expiration}
              style={{ color: secondaryColor }}
            >
              {expiration.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BundleCardFront; 