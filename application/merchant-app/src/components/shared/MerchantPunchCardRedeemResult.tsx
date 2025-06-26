import React from 'react';
import { MerchantDto } from 'e-punch-common-core';
import styles from './MerchantPunchCardRedeemResult.module.css';

interface MerchantPunchCardRedeemResultProps {
  merchant: MerchantDto;
  className?: string;
}

export const MerchantPunchCardRedeemResult: React.FC<MerchantPunchCardRedeemResultProps> = ({
  merchant,
  className = ''
}) => {
  return (
    <div className={`${styles.redeemResultContent} ${className}`}>
      <div className={styles.redeemResultHeader}>
        <h3>🎁 Reward Redemption</h3>
        <p className={styles.cardId}>Card ID: demo123...</p>
      </div>
      <div className={styles.punchCardDetails}>
        <h4>Punch Card Details</h4>
        <div className={styles.detailsContent}>
          <p><strong>Shop:</strong> {merchant.name}</p>
          <p><strong>Address:</strong> {merchant.address || '123 Main Street'}</p>
          <p><strong>Punches:</strong> 10/10</p>
          <p><strong>Status:</strong> REWARD_READY</p>
        </div>
      </div>
      <div className={styles.loyaltyProgramDetails}>
        <h4>Loyalty Program</h4>
        <div className={styles.detailsContent}>
          <p><strong>Name:</strong> {merchant.name} Rewards</p>
          <p><strong>Reward:</strong> Free coffee</p>
          <p className={styles.programDescription}>
            Get a free coffee after 10 punches!
          </p>
        </div>
      </div>
      <div className={styles.redeemButtonContainer}>
        <div className={styles.redeemButton}>REDEEM!</div>
      </div>
    </div>
  );
}; 