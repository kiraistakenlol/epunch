import React from 'react';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { EpunchBox } from './EpunchBox';
import { EpunchButton } from './EpunchButton';
import { EpunchTypography } from './EpunchTypography';
import { EpunchAlert } from './EpunchAlert';
import EpunchProgress from './EpunchProgress';

interface EpunchPageProps {
  title?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  showBackButton?: boolean;
  backTo?: string;
  backButtonText?: string;
  maxWidth?: number;
  padding?: number;
  centerContent?: boolean;
}

const EpunchPage: React.FC<EpunchPageProps> = ({
  title,
  children,
  loading = false,
  error = null,
  showBackButton = false,
  backTo,
  backButtonText = 'Back',
  maxWidth = 1200,
  padding = 2,
  centerContent = false,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {  
      navigate(-1);
    }
  };

  return (
    <EpunchBox
      sx={{
        padding,
        maxWidth,
        margin: '0 auto',
        minHeight: '100vh',
        border: '2px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      {(title || showBackButton) && (
        <EpunchBox sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
          {showBackButton && (
            <EpunchButton
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              {backButtonText}
            </EpunchButton>
          )}
          
          {title && (
            <EpunchTypography variant="pageTitle" color="light" textShadow>
              {title}
            </EpunchTypography>
          )}
        </EpunchBox>
      )}
      
      {error && (
        <EpunchBox sx={{ marginBottom: 2 }}>
          <EpunchAlert variant="error">
            {error}
          </EpunchAlert>
        </EpunchBox>
      )}
      
      {loading ? (
        <EpunchBox 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px'
          }}
        >
          <EpunchProgress color="primary" />
        </EpunchBox>
      ) : (
        <EpunchBox
          sx={{
            ...(centerContent && {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }),
          }}
        >
          {children}
        </EpunchBox>
      )}
    </EpunchBox>
  );
};

export default EpunchPage; 