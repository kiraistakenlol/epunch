import React from 'react';
import { BundleProgramSummaryDto } from 'e-punch-common-core';
import styles from './BundleCardFront.module.css';

interface BundleCardFrontProps {
  bundleProgram: BundleProgramSummaryDto;
  remainingQuantity: number;
  originalQuantity: number;
  expiresAt: string | null;
  isSelected: boolean;
  isExpired: boolean;
  isUsedUp: boolean;
  isAvailable: boolean;
}

const BundleCardFront: React.FC<BundleCardFrontProps> = ({
  bundleProgram,
  remainingQuantity,
  originalQuantity,
  expiresAt
}) => {
  const getDaysUntilExpiration = () => {
    if (!expiresAt) return { text: null, days: null };
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Expired', days: diffDays };
    if (diffDays === 0) return { text: 'Expires today', days: 0 };
    if (diffDays === 1) return { text: 'Expires in 1 day', days: 1 };
    return { text: `Expires in ${diffDays} days`, days: diffDays };
  };

  const getExpirationColorClass = () => {
    const expiration = getDaysUntilExpiration();
    if (!expiration.text || expiration.days === null) return '';
    
    if (expiration.days < 0) return styles.expired; // Red for expired
    if (expiration.days <= 7) return styles.expiringSoon; // Orange for expiring soon
    if (expiration.days <= 30) return styles.expiringMedium; // Yellow for medium term
    return styles.expiringLater; // Green for long term
  };

  const expiration = getDaysUntilExpiration();

  return (
    <div className={styles.frontCard}>
      {/* Top section with merchant name */}
      <div className={styles.topSection}>
        <div className={styles.merchantName}>{bundleProgram.merchant.name}</div>
      </div>

      {/* Main content section with quantity and item name close together */}
      <div className={styles.mainContent}>
        <div className={styles.quantity}>
          {remainingQuantity}/{originalQuantity}
        </div>
        <div className={styles.itemName}>{bundleProgram.itemName}</div>
      </div>

      {/* Bottom section with expiration */}
      {expiration.text && (
        <div className={`${styles.expiration} ${getExpirationColorClass()}`}>
          {expiration.text}
        </div>
      )}
    </div>
  );
};

export default BundleCardFront; 