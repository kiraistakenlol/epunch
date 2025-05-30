import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { QRCodeCanvas } from 'qrcode.react';
import type { QRValueDto } from 'e-punch-common-core';
import type { RootState } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import { selectSelectedCard } from '../punchCards/punchCardsSlice';
import { selectLoyaltyProgramById } from '../loyaltyPrograms/loyaltyProgramsSlice';

const QRCode: React.FC = () => {
  const userId = useSelector((state: RootState) => selectUserId(state));
  const selectedCard = useSelector((state: RootState) => selectSelectedCard(state));
  const loyaltyProgram = useSelector((state: RootState) => 
    selectedCard ? selectLoyaltyProgramById(state, selectedCard.loyaltyProgramId) : undefined
  );
  const [containerSize, setContainerSize] = useState({
    width: 'min(250px, 80vw)',
    height: 'min(250px, 80vw)',
    minWidth: '150px',
    minHeight: '150px',
    padding: '15px'
  });

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

  const updateContainerSize = () => {
    if (typeof window !== 'undefined') {
      const height = window.innerHeight;
      if (height <= 500) {
        setContainerSize({
          width: 'min(120px, 50vw)',
          height: 'min(120px, 50vw)',
          minWidth: '100px',
          minHeight: '100px',
          padding: '5px'
        });
      } else if (height <= 550) {
        setContainerSize({
          width: 'min(140px, 55vw)',
          height: 'min(140px, 55vw)',
          minWidth: '110px',
          minHeight: '110px',
          padding: '6px'
        });
      } else if (height <= 600) {
        setContainerSize({
          width: 'min(150px, 60vw)',
          height: 'min(150px, 60vw)',
          minWidth: '120px',
          minHeight: '120px',
          padding: '8px'
        });
      } else if (height <= 700) {
        setContainerSize({
          width: 'min(200px, 70vw)',
          height: 'min(200px, 70vw)',
          minWidth: '140px',
          minHeight: '140px',
          padding: '10px'
        });
      } else {
        setContainerSize({
          width: 'min(250px, 80vw)',
          height: 'min(250px, 80vw)',
          minWidth: '150px',
          minHeight: '150px',
          padding: '15px'
        });
      }
    }
  };

  useEffect(() => {
    updateContainerSize();
    
    const handleResize = () => {
      updateContainerSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const qrValue = generateQRValue();
  const isRewardMode = selectedCard?.status === 'REWARD_READY';

  if (!qrValue) {
    return null;
  }

  const getQRModeText = () => {
    if (isRewardMode && loyaltyProgram) {
      return (
        <>
          Show to get{' '}
          <span className="fs-6 fw-bold text-decoration-underline">{loyaltyProgram.rewardDescription}</span>
        </>
      );
    }
    return 'Your QR Code';
  };

  return (
    <div className="text-center">
      <div style={{ 
        width: containerSize.width,
        height: containerSize.height,
        minWidth: containerSize.minWidth,
        minHeight: containerSize.minHeight,
        backgroundColor: '#f5f5dc',
        borderRadius: '8px',
        padding: containerSize.padding,
        boxShadow: isRewardMode 
          ? '0 4px 8px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 215, 0, 0.6)' 
          : '0 4px 8px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: isRewardMode ? 'box-shadow' : 'auto',
        margin: '0 auto'
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
      <div className="mt-3">
        <small className={`fw-medium ${isRewardMode ? 'text-warning' : 'text-white'}`}>
          {getQRModeText()}
        </small>
      </div>
    </div>
  );
};

export default QRCode; 