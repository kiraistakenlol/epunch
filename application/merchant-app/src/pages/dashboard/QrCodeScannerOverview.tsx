import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCodeScanner } from '@mui/icons-material';
import { 
  EpunchCenteredContainer,
  EpunchFlexRow,
  EpunchTypography 
} from '../../components/foundational';
import { colors } from '../../theme/constants';
import { useMobile } from '../../hooks/useMobile';

export const QrCodeScannerOverview: React.FC = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();

  const handleNavigateToScanner = () => {
    navigate('/scanner');
  };

  return (
    <EpunchCenteredContainer 
      minHeight={isMobile ? 'auto' : '170px'}
      style={{ cursor: 'pointer' }}
      onClick={handleNavigateToScanner}
    >
      <EpunchFlexRow 
        justify={isMobile ? 'center' : 'start'}
        gap="16px"
        style={{ marginBottom: '16px' }}
      >
        <QrCodeScanner sx={{ fontSize: isMobile ? 28 : 32, color: colors.primary }} />
        <EpunchTypography 
          variant="cardTitle"
          color="primary"
          bold
          style={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}
        >
          QR Scanner
        </EpunchTypography>
      </EpunchFlexRow>
      
      <EpunchTypography
        variant="body"
        color="secondary"
        style={{
          textAlign: isMobile ? 'center' : 'left',
          marginTop: '16px',
          fontSize: isMobile ? '0.9rem' : '1rem'
        }}
      >
        Scan customer QR codes to add punches or redeem rewards
      </EpunchTypography>
    </EpunchCenteredContainer>
  );
}; 