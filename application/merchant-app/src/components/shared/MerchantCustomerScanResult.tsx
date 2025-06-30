import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { MerchantPageMockup } from './MerchantPageMockup';
import { MerchantActionButton } from './MerchantActionButton';
import styles from './MerchantCustomerScanResult.module.css';

interface MerchantCustomerScanResultProps {
  loyaltyProgram: LoyaltyProgramDto;
  className?: string;
}

export const MerchantCustomerScanResult: React.FC<MerchantCustomerScanResultProps> = ({
  loyaltyProgram,
  className = ''
}) => {
  const { t } = useI18n('merchantOnboarding');
  const currentPunches = Math.floor(loyaltyProgram.requiredPunches * 0.7);
  const totalPunches = loyaltyProgram.requiredPunches;
  
  const programName = loyaltyProgram.name;
  const progress = `${currentPunches}/${totalPunches} punches`;

  return (
    <MerchantPageMockup className={className}>
      <div className={styles.scanResultHeader}>
        <h3>{t('merchantInterface.selectProgram.title')}</h3>
      </div>
      <div className={styles.loyaltyProgramsList}>
        <div className={`${styles.loyaltyProgram} ${styles.selected}`}>
          <div className={styles.programInfo}>
            <span className={styles.programName}>{programName}</span>
            <span className={styles.programProgress}>{progress}</span>
          </div>
          <div className={`${styles.selectedIndicator} ${styles.visible}`}>
            ✓
          </div>
        </div>
      </div>
      <MerchantActionButton>{t('merchantInterface.selectProgram.punchButton')}</MerchantActionButton>
    </MerchantPageMockup>
  );
}; 