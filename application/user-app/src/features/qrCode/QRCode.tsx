import React from 'react';
import { useSelector } from 'react-redux';
import { QRCodeCanvas } from 'qrcode.react';
import type { QRValueDto } from 'e-punch-common-core';
import type { RootState } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import { selectSelectedCard } from '../punchCards/punchCardsSlice';

const QRCode: React.FC = () => {
  const userId = useSelector((state: RootState) => selectUserId(state));
  const selectedCard = useSelector((state: RootState) => selectSelectedCard(state));

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

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: isRewardMode ? '0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 215, 0, 0.6)' : 'none',
      borderRadius: '8px',
      transition: 'box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: isRewardMode ? 'box-shadow' : 'auto'
    }}>
      <QRCodeCanvas 
        value={qrValue} 
        size={400} 
        level="H" 
        style={{ 
          width: '100%', 
          height: 'auto', 
          maxWidth: '200px', 
          maxHeight: '200px',
          minWidth: '120px',
          minHeight: '120px'
        }}
      />
    </div>
  );
};

export default QRCode; 