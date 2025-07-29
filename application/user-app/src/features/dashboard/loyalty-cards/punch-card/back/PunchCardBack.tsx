import React from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useI18n } from 'e-punch-common-ui';
import { useAppSelector } from '../../../../../store/hooks';
import { selectLoyaltyProgramById } from '../../../../loyaltyPrograms/loyaltyProgramsSlice';
import styles from './PunchCardBack.module.css';
import layoutStyles from '../shared/PunchCardLayout.module.css';

interface PunchCardBackProps extends Pick<PunchCardDto, 'loyaltyProgramId' | 'shopName' | 'shopAddress' | 'totalPunches'> {
  shopMapsUrl?: string;
}

const PunchCardBack: React.FC<PunchCardBackProps> = ({
  loyaltyProgramId,
  shopName,
  shopAddress,
  totalPunches,
  shopMapsUrl
}) => {
  const { t } = useI18n('punchCards');
  const loyaltyProgram = useAppSelector(state => selectLoyaltyProgramById(state, loyaltyProgramId));

  const getDefaultMapsUrl = (merchantName: string, merchantAddress: string) => {
    const query = encodeURIComponent(`${merchantName}, ${merchantAddress}`);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      return `http://maps.apple.com/?q=${query}`;
    } else {
      return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
  };

  return (
    <div 
      className={`${layoutStyles.defaultCardLayout} ${styles.backCard}`}
    >
      <div className={`${layoutStyles.cardSection} ${styles.header}`}>
      </div>
      <div 
        className={`${layoutStyles.cardSection} ${styles.body}`}
      >
        {loyaltyProgram && (
          <div className={`${styles.rewardMessage} ${styles.rewardText}`}>
            <div>
              {t('back.collectMessage', { totalPunches, shopName })}
            </div>
            <div className={styles.rewardName}>
              {loyaltyProgram.rewardDescription}
            </div>
          </div>
        )}
      </div>
      <div 
        className={`${layoutStyles.cardSection} ${styles.footer}`}
      >
        {shopAddress && (
          <a 
            href={shopMapsUrl || getDefaultMapsUrl(shopName, shopAddress)}
            className={styles.addressText}
            target="_blank"
            rel="noopener noreferrer"
          >
            📍 {shopAddress}
          </a>
        )}
      </div>
    </div>
  );
};

export default PunchCardBack; 