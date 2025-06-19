import React from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../../../store/hooks';
import { selectLoyaltyProgramById } from '../../../../loyaltyPrograms/loyaltyProgramsSlice';
import styles from './PunchCardBack.module.css';
import layoutStyles from '../shared/PunchCardLayout.module.css';

interface PunchCardBackProps extends Pick<PunchCardDto, 'loyaltyProgramId' | 'shopName' | 'shopAddress' | 'totalPunches' | 'styles'> {
}

const PunchCardBack: React.FC<PunchCardBackProps> = ({
  loyaltyProgramId,
  shopName,
  shopAddress,
  totalPunches,
  styles: cardStyles
}) => {
  const loyaltyProgram = useAppSelector(state => selectLoyaltyProgramById(state, loyaltyProgramId));

  return (
    <div className={`${layoutStyles.defaultCardLayout} ${styles.backCard}`}>
      {cardStyles?.logoUrl && (
        <img src={cardStyles.logoUrl} alt="" className={styles.logoBackground} />
      )}
      <div className={`${layoutStyles.cardSection} ${styles.header}`}>
        <span className={styles.headerTitle}>Details</span>
      </div>
      <div className={`${layoutStyles.cardSection} ${styles.body}`}>
        {loyaltyProgram && (
          <div className={`${styles.rewardMessage} ${styles.rewardText}`}>
            <div>Collect <span className={styles.totalPunches}>{totalPunches}</span> punches
             at <span className={styles.shopName}>{shopName}</span> and enjoy</div>
            <div className={styles.rewardName}>🎁 {loyaltyProgram.rewardDescription}</div>
          </div>
        )}
      </div>
      <div className={`${layoutStyles.cardSection} ${styles.footer}`}>
        {shopAddress && (
          <span className={styles.addressText}>📍 {shopAddress}</span>
        )}
      </div>
    </div>
  );
};

export default PunchCardBack; 