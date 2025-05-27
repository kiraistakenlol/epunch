import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  isRewardMode?: boolean;
}

const QRCode: React.FC<QRCodeProps> = ({ value, isRewardMode = false }) => {
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
        value={value} 
        size={400} 
        level="H" 
        style={{ width: '100%', height: 'auto', maxWidth: '200px', maxHeight: '200px' }}
      />
    </div>
  );
};

export default QRCode; 