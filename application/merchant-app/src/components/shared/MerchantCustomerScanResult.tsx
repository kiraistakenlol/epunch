import React from 'react';
import { MerchantDto } from 'e-punch-common-core';
import styles from './MerchantCustomerScanResult.module.css';

interface MerchantCustomerScanResultProps {
  merchant: MerchantDto;
  className?: string;
}

export const MerchantCustomerScanResult: React.FC<MerchantCustomerScanResultProps> = ({
  merchant,
  className = ''
}) => {
  return (
    <div className={`${styles.scanResultContent} ${className}`}>
      <div className={styles.scanResultHeader}>
        <h3>Select Loyalty Program</h3>
        <p className={styles.userId}>User ID: abc123...</p>
      </div>
      <div className={styles.loyaltyProgramsList}>
        <div className={`${styles.loyaltyProgram} ${styles.selected}`}>
          <div className={styles.programInfo}>
            <span className={styles.programName}>{merchant.name} Rewards</span>
            <span className={styles.programProgress}>7/10 punches</span>
          </div>
          <div className={styles.selectedIndicator}>✓</div>
        </div>
        <div className={styles.loyaltyProgram}>
          <div className={styles.programInfo}>
            <span className={styles.programName}>VIP Program</span>
            <span className={styles.programProgress}>2/5 punches</span>
          </div>
        </div>
      </div>
      <div className={styles.actionButtonContainer}>
        <div className={styles.punchButton}>PUNCH</div>
      </div>
    </div>
  );
}; 