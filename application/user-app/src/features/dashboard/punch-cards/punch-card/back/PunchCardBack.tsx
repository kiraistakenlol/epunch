import React from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useLocalization } from 'e-punch-common-ui';
import { useAppSelector } from '../../../../../store/hooks';
import { selectLoyaltyProgramById } from '../../../../loyaltyPrograms/loyaltyProgramsSlice';
import { CustomizableCardStyles } from '../../../../../utils/cardStyles';
import styles from './PunchCardBack.module.css';
import layoutStyles from '../shared/PunchCardLayout.module.css';

interface PunchCardBackProps extends Pick<PunchCardDto, 'loyaltyProgramId' | 'shopName' | 'shopAddress' | 'totalPunches'> {
  resolvedStyles: CustomizableCardStyles;
}

const PunchCardBack: React.FC<PunchCardBackProps> = ({
  loyaltyProgramId,
  shopName,
  shopAddress,
  totalPunches,
  resolvedStyles
}) => {
  const { t } = useLocalization();
  const loyaltyProgram = useAppSelector(state => selectLoyaltyProgramById(state, loyaltyProgramId));

  return (
    <div 
      className={`${layoutStyles.defaultCardLayout} ${styles.backCard}`}
      style={{ backgroundColor: resolvedStyles.colors.backBodyBg }}
    >
      {resolvedStyles.logoUrl && (
        <img src={resolvedStyles.logoUrl} alt="" className={styles.logoBackground} />
      )}
      <div 
        className={`${layoutStyles.cardSection} ${styles.header}`}
        style={{
          backgroundColor: resolvedStyles.colors.backHeaderBg,
          color: resolvedStyles.colors.textColor
        }}
      >
        <span 
          className={styles.headerTitle}
          style={{ color: resolvedStyles.colors.textColor }}
        >
          {t('punchCards.back.details')}
        </span>
      </div>
      <div 
        className={`${layoutStyles.cardSection} ${styles.body}`}
        style={{ color: resolvedStyles.colors.textColor }}
      >
        {loyaltyProgram && (
          <div className={`${styles.rewardMessage} ${styles.rewardText}`}>
            <div style={{ color: resolvedStyles.colors.textColor }}>
              {t('punchCards.back.collectMessage', { totalPunches, shopName })}
            </div>
            <div 
              className={styles.rewardName}
              style={{ color: resolvedStyles.colors.textColor }}
            >
              🎁 {loyaltyProgram.rewardDescription}
            </div>
          </div>
        )}
      </div>
      <div 
        className={`${layoutStyles.cardSection} ${styles.footer}`}
        style={{ color: resolvedStyles.colors.textColor }}
      >
        {shopAddress && (
          <span 
            className={styles.addressText}
            style={{ color: resolvedStyles.colors.textColor }}
          >
            📍 {shopAddress}
          </span>
        )}
      </div>
    </div>
  );
};

export default PunchCardBack; 