import React from 'react';
import { MerchantDto, LoyaltyProgramDto } from 'e-punch-common-core';
import { MerchantPageMockup } from './MerchantPageMockup';
import { MerchantActionButton } from './MerchantActionButton';
import styles from './MerchantPunchCardRedeemResult.module.css';

interface MerchantPunchCardRedeemResultProps {
  merchant: MerchantDto;
  loyaltyProgram?: LoyaltyProgramDto;
  className?: string;
}

export const MerchantPunchCardRedeemResult: React.FC<MerchantPunchCardRedeemResultProps> = ({
  merchant,
  loyaltyProgram,
  className = ''
}) => {
  const programName = loyaltyProgram?.name || `${merchant.name} Rewards`;
  const rewardDescription = loyaltyProgram?.rewardDescription || 'Free coffee';

  return (
    <MerchantPageMockup className={className}>
      <div className={styles.header}>
        <h3>🎁 Reward</h3>
      </div>
      <div className={styles.rewardInfo}>
        <p className={styles.programName}>{programName}</p>
        <p className={styles.rewardText}>Client gets: {rewardDescription}</p>
      </div>
      <MerchantActionButton>REDEEM!</MerchantActionButton>
    </MerchantPageMockup>
  );
}; 