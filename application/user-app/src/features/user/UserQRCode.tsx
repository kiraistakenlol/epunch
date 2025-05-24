import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface UserQRCodeProps {
  userId: string;
}

const UserQRCode: React.FC<UserQRCodeProps> = ({ userId }) => {
  return (
    <QRCodeCanvas 
      value={userId} 
      size={400} 
      level="H" 
      style={{ width: '100%', height: 'auto' }}
    />
  );
};

export default UserQRCode; 