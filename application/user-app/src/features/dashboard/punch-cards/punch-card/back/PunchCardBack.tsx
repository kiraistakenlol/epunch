import React from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../../../store/hooks';
import { selectLoyaltyProgramById } from '../../../../loyaltyPrograms/loyaltyProgramsSlice';
import styles from './PunchCardBack.module.css';

interface PunchCardBackProps extends Pick<PunchCardDto, 'loyaltyProgramId' | 'shopName' | 'shopAddress' | 'currentPunches' | 'totalPunches'> {
}

const PunchCardBack: React.FC<PunchCardBackProps> = ({
  loyaltyProgramId,
  shopName,
  shopAddress,
  currentPunches,
  totalPunches
}) => {
  const loyaltyProgram = useAppSelector(state => selectLoyaltyProgramById(state, loyaltyProgramId));

  return (
    <div className={styles.cardBack}>
      <div className={styles.backHeader}>
        <span className={styles.backHeaderTitle}>Details</span>
      </div>
      <div className={styles.backContent}>
        <div className={styles.infoSection}>
          <div className={styles.infoLabel}>Merchant</div>
          <div className={styles.infoValue}>{shopName}</div>
        </div>
        
        {shopAddress && (
          <div className={styles.infoSection}>
            <div className={styles.infoLabel}>Address</div>
            <div className={styles.infoValue}>{shopAddress}</div>
          </div>
        )}
        
        {loyaltyProgram && (
          <>
            <div className={styles.infoSection}>
              <div className={styles.infoLabel}>Program</div>
              <div className={styles.infoValue}>{loyaltyProgram.name}</div>
            </div>
            
            {loyaltyProgram.description && (
              <div className={styles.infoSection}>
                <div className={styles.infoLabel}>Description</div>
                <div className={styles.infoValue}>{loyaltyProgram.description}</div>
              </div>
            )}
            
            <div className={styles.infoSection}>
              <div className={styles.infoLabel}>Reward</div>
              <div className={styles.infoValue}>{loyaltyProgram.rewardDescription}</div>
            </div>
          </>
        )}
        
        <div className={styles.infoSection}>
          <div className={styles.infoLabel}>Progress</div>
          <div className={styles.infoValue}>{currentPunches} / {totalPunches} punches</div>
        </div>
      </div>
      <div className={styles.backFooter}>
        <span className={styles.tapToFlipHint}>Tap to flip back</span>
      </div>
    </div>
  );
};

export default PunchCardBack; 