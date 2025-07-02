import React from 'react';
import { useI18n } from 'e-punch-common-ui';
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
  const { t } = useI18n('merchantOnboarding');
  const programName = loyaltyProgram?.name || `${merchant.name} Rewards`;
  const rewardDescription = loyaltyProgram?.rewardDescription || 'Free coffee';

  return (
    <MerchantPageMockup className={className}>
      <div className={styles.header}>
        <h3>{t('merchantInterface.reward.title')}</h3>
      </div>
      <div className={styles.rewardInfo}>
        <p className={styles.programName}>{programName}</p>
        <p className={styles.rewardText}>{t('merchantInterface.reward.clientGets', { reward: rewardDescription })}</p>
      </div>
      <MerchantActionButton>{t('merchantInterface.reward.redeemButton')}</MerchantActionButton>
    </MerchantPageMockup>
  );
}; 