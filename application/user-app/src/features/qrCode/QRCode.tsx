import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'react-qr-code';
import { useLocalization } from 'e-punch-common-ui';
import type { QRValueDto } from 'e-punch-common-core';
import type { RootState } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import { selectSelectedCard } from '../punchCards/punchCardsSlice';
import { selectLoyaltyProgramById } from '../loyaltyPrograms/loyaltyProgramsSlice';
import styles from './QRCode.module.css';
import { appColors } from '../../theme/constants';

const QRCodeComponent: React.FC = () => {
  const { t } = useLocalization();
  const [isExpanded, setIsExpanded] = useState(false);
  const userId = useSelector((state: RootState) => selectUserId(state));
  const selectedCard = useSelector((state: RootState) => selectSelectedCard(state));
  const loyaltyProgram = useSelector((state: RootState) =>
    selectedCard ? selectLoyaltyProgramById(state, selectedCard.loyaltyProgramId) : undefined
  );

  const isRewardMode = selectedCard?.status === 'REWARD_READY';


  const qrValue = isRewardMode && selectedCard
    ? JSON.stringify({ type: 'redemption_punch_card_id', punch_card_id: selectedCard.id } as QRValueDto)
    : userId
      ? JSON.stringify({ type: 'user_id', user_id: userId } as QRValueDto)
      : '';

  if (!qrValue) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      data-expanded={isExpanded}
      className={styles.container}
      onClick={e => e.stopPropagation()}>
      <div
        className={styles.qrWrapper}
        data-expanded={isExpanded}
        data-reward={isRewardMode}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        <QRCode
          value={qrValue}
          level="H"
          style={{ width: '100%', height: '100%' }}
          fgColor={appColors.epunchBlack}
          bgColor={appColors.epunchWhite}
        />
      </div>
      <div 
        className={styles.modeText}
        style={{ opacity: isExpanded ? 0 : 1, pointerEvents: isExpanded ? 'none' : 'auto' }}
      >
        {isRewardMode && loyaltyProgram ? (
          <>
            {t('qr.showToGet', { reward: loyaltyProgram.rewardDescription })}
          </>
        ) : (
          t('qr.myCode')
        )}
      </div>
    </div>
  );
};

export default QRCodeComponent; 