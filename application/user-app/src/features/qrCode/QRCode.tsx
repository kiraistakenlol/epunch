import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeProps {
  value: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value }) => {
  return (
    <QRCodeCanvas 
      value={value} 
      size={400} 
      level="H" 
      style={{ width: '100%', height: 'auto' }}
    />
  );
};

export default QRCode; 