import React from 'react';
import { useSelector } from 'react-redux';
import { QRCodeCanvas } from 'qrcode.react';
import { selectUserId, selectAuthLoading } from '../auth/authSlice';
import type { RootState } from '../../store/store';

const UserQRCode: React.FC = () => {
  const currentUserId = useSelector((state: RootState) => selectUserId(state));
  const isLoading = useSelector((state: RootState) => selectAuthLoading(state));

  

  if (isLoading) {
    return <p>Loading QR Code...</p>;
  }

  if (!currentUserId) {
    return <p>Error: Could not retrieve user ID for QR Code.</p>;
  }

  const qrValue = currentUserId;

  return (
    <div>
      <QRCodeCanvas value={qrValue} size={170} level="H" />
    </div>
  );
};

export default UserQRCode; 