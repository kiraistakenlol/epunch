import React from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../../../store/hooks';
import { selectLoyaltyProgramById } from '../../../../loyaltyPrograms/loyaltyProgramsSlice';
import styles from './PunchCardBack.module.css';

interface PunchCardBackProps extends Pick<PunchCardDto, 'loyaltyProgramId' | 'shopName' | 'shopAddress' | 'totalPunches'> {
}

const PunchCardBack: React.FC<PunchCardBackProps> = ({
  loyaltyProgramId,
  shopName,
  shopAddress,
  totalPunches
}) => {
  const loyaltyProgram = useAppSelector(state => selectLoyaltyProgramById(state, loyaltyProgramId));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Details</span>
      </div>
      <div className={styles.body}>
        {loyaltyProgram && (
            <div className={`${styles.rewardMessage} ${styles.rewardText}`}>
              <div>Collect {totalPunches} punches at <span className={styles.shopName}>{shopName}</span> and enjoy</div>
              <div className={styles.rewardName}>🎁 {loyaltyProgram.rewardDescription}</div>
            </div>
        )}
      </div>
      <div className={styles.backFooter}>
        {shopAddress && (
          <span className={styles.addressText}>📍 {shopAddress}</span>
        )}
      </div>
    </div>
  );
};

export default PunchCardBack; 