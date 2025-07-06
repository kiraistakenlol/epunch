import React from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useI18n } from 'e-punch-common-ui';
import { useAppSelector } from '../../../../../store/hooks';
import { selectLoyaltyProgramById } from '../../../../loyaltyPrograms/loyaltyProgramsSlice';
import { CustomizableCardStyles } from '../../../../../utils/cardStyles';
import styles from './PunchCardBack.module.css';
import layoutStyles from '../shared/PunchCardLayout.module.css';

interface PunchCardBackProps extends Pick<PunchCardDto, 'loyaltyProgramId' | 'shopName' | 'shopAddress' | 'totalPunches'> {
  resolvedStyles: CustomizableCardStyles;
  shopMapsUrl?: string;
}

const PunchCardBack: React.FC<PunchCardBackProps> = ({
  loyaltyProgramId,
  shopName,
  shopAddress,
  totalPunches,
  resolvedStyles,
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
          {t('back.details')}
        </span>
      </div>
      <div 
        className={`${layoutStyles.cardSection} ${styles.body}`}
        style={{ color: resolvedStyles.colors.textColor }}
      >
        {loyaltyProgram && (
          <div className={`${styles.rewardMessage} ${styles.rewardText}`}>
            <div style={{ color: resolvedStyles.colors.textColor }}>
              {t('back.collectMessage', { totalPunches, shopName })}
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
          <a 
            href={shopMapsUrl || getDefaultMapsUrl(shopName, shopAddress)}
            className={styles.addressText}
            style={{ color: resolvedStyles.colors.textColor }}
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