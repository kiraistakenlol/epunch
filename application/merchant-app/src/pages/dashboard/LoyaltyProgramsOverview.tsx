import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loyalty, Add as AddIcon } from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../store/hooks';
import { 
  EpunchCenteredContainer,
  EpunchFlexRow,
  EpunchIconButton,
  EpunchTypography 
} from '../../components/foundational';
import { colors } from '../../theme/constants';
import { useMobile } from '../../hooks/useMobile';

export const LoyaltyProgramsOverview: React.FC = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const merchantId = useAppSelector(state => state.auth.merchant?.id);
  
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyPrograms = async () => {
      if (!merchantId) return;
      
      try {
        const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
        setLoyaltyPrograms(programs);
      } catch (error) {
        console.error('Failed to fetch loyalty programs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoyaltyPrograms();
  }, [merchantId]);

  const handleNavigateToLoyaltyPrograms = () => {
    navigate('/loyalty-programs');
  };

  const handleCreateLoyaltyProgram = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/loyalty-programs/create');
  };

  return (
    <EpunchCenteredContainer 
      minHeight={isMobile ? 'auto' : '170px'}
      style={{ position: 'relative', cursor: 'pointer' }}
      onClick={handleNavigateToLoyaltyPrograms}
    >
      <EpunchIconButton
        variant="primary"
        position="top-right"
        size="small"
        onClick={handleCreateLoyaltyProgram}
      >
        <AddIcon fontSize="small" />
      </EpunchIconButton>
      
      <EpunchFlexRow 
        justify={isMobile ? 'center' : 'start'}
        gap="16px"
        style={{ marginBottom: '16px' }}
      >
        <Loyalty sx={{ fontSize: isMobile ? 28 : 32, color: colors.primary }} />
        <EpunchTypography 
          variant="cardTitle"
          color="primary"
          bold
          style={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}
        >
          Loyalty Programs
        </EpunchTypography>
      </EpunchFlexRow>
      
      <EpunchTypography
        variant="pageTitle"
        color="primary"
        textShadow
        style={{
          textAlign: 'center',
          marginBottom: '8px',
          fontSize: isMobile ? '2.5rem' : '3.75rem',
        }}
      >
        {isLoading ? '...' : loyaltyPrograms.length}
      </EpunchTypography>
      
      <EpunchTypography
        variant="body"
        color="secondary"
        style={{
          textAlign: 'center',
          fontWeight: 500,
          fontSize: isMobile ? '0.9rem' : '1rem',
        }}
      >
        Active programs
      </EpunchTypography>
    </EpunchCenteredContainer>
  );
}; 