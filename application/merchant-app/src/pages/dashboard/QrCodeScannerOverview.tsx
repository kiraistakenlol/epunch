import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCodeScanner } from '@mui/icons-material';
import { colors } from '../../theme/constants';
import { DashboardCard } from './DashboardCard';

export const QrCodeScannerOverview: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToScanner = () => {
    navigate('/scanner');
  };

  return (
    <DashboardCard>
      <div style={{ 
        cursor: 'pointer',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '0.8em',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center'
      }} onClick={handleNavigateToScanner}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5em'
        }}>
          <QrCodeScanner sx={{ fontSize: '1.5em', color: colors.primary }} />
          <span style={{ fontSize: '0.9em', fontWeight: 500, color: colors.text.primary }}>
            QR Scanner
          </span>
        </div>
        
        <div style={{ 
          fontSize: '0.75em', 
          color: colors.text.secondary,
          lineHeight: 1.4,
          maxWidth: '85%'
        }}>
          Scan customer QR codes to add punches or redeem rewards
        </div>
      </div>
    </DashboardCard>
  );
}; 