import React from 'react';
import { useSelector } from 'react-redux';
import { QRCodeCanvas } from 'qrcode.react';
import type { QRValueDto } from 'e-punch-common-core';
import type { RootState } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import { colors } from '../../theme';
import { selectSelectedCard } from '../punchCards/punchCardsSlice';
import { selectLoyaltyProgramById } from '../loyaltyPrograms/loyaltyProgramsSlice';

const QRCode: React.FC = () => {
  const userId = useSelector((state: RootState) => selectUserId(state));
  const selectedCard = useSelector((state: RootState) => selectSelectedCard(state));
  const loyaltyProgram = useSelector((state: RootState) => 
    selectedCard ? selectLoyaltyProgramById(state, selectedCard.loyaltyProgramId) : undefined
  );
  const generateQRValue = (): string => {
    const isRewardMode = selectedCard?.status === 'REWARD_READY';
    
    if (isRewardMode && selectedCard) {
      const qrData: QRValueDto = {
        type: 'redemption_punch_card_id',
        punch_card_id: selectedCard.id
      };
      return JSON.stringify(qrData);
    } else if (userId) {
      const qrData: QRValueDto = {
        type: 'user_id',
        user_id: userId
      };
      return JSON.stringify(qrData);
    }
    return '';
  };

  const qrValue = generateQRValue();
  const isRewardMode = selectedCard?.status === 'REWARD_READY';

  if (!qrValue) {
    return null;
  }

  const getQRModeText = () => {
    if (isRewardMode && loyaltyProgram) {
      return (
        <>
          show to get{' '}
          <span className="fs-8 fw-bold text-decoration-underline">{loyaltyProgram.rewardDescription}</span>
        </>
      );
    }
    return 'My QR Code';
  };

  return (
    <div className="text-center">
      <style>
        {`
          @keyframes qrPulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}
      </style>
      <div style={{ 
        width: 'clamp(120px, 25svh, 250px)',
        height: 'clamp(120px, 25svh, 250px)',
        backgroundColor: colors.background.white,
        padding: 'clamp(5px, 2svh, 15px)',
        boxShadow: `-14px 6px 16px ${colors.shadow.black}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        animation: isRewardMode ? 'qrPulse 2s ease-in-out infinite' : 'none',
        willChange: isRewardMode ? 'transform' : 'auto'
      }}>
        <QRCodeCanvas 
          value={qrValue} 
          size={400} 
          level="H" 
          style={{ 
            width: '100%', 
            height: 'auto',
            backgroundColor: 'green'
          }}
        />
      </div>
      <div className="mt-3">
        <div 
          className="fw-bold" 
          style={{ 
            color: isRewardMode ? colors.reward.selected : 'black',
            fontSize: isRewardMode ? '1.25rem' : '1.1rem',
            textShadow: isRewardMode ? `1px 1px 3px rgba(0, 0, 0, 0.6)` : 'none',
            textTransform: isRewardMode ? 'uppercase' : 'none',
            letterSpacing: isRewardMode ? '0.5px' : 'normal'
          }}
        >
          {getQRModeText()}
        </div>
      </div>
    </div>
  );
};

export default QRCode; 