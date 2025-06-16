import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loyalty, Add as AddIcon } from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../store/hooks';
import { IconButton } from '@mui/material';
import { colors } from '../../theme/constants';
import { DashboardCard } from './DashboardCard';

export const LoyaltyProgramsOverview: React.FC = () => {
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
    <DashboardCard>
      <div
        style={{
          position: 'relative',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={handleNavigateToLoyaltyPrograms}
      >
        <IconButton
          onClick={handleCreateLoyaltyProgram}
          sx={{
            position: 'absolute',
            top: '0.3em',
            right: '0.3em',
            backgroundColor: colors.primaryDark,
            color: colors.text.light,
            width: '1.5em',
            height: '1.5em',
            '&:hover': {
              backgroundColor: colors.primary
            }
          }}
        >
          <AddIcon sx={{ fontSize: '0.8em' }} />
        </IconButton>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5em'
        }}>
          <Loyalty sx={{ fontSize: '1.5em', color: colors.primary }} />
          <span style={{ fontSize: '0.9em', fontWeight: 500, color: colors.text.primary }}>
            Loyalty Programs
          </span>
        </div>
        
        <div style={{ 
          fontSize: '2.5em', 
          fontWeight: 'bold',
          color: colors.text.primary,
          lineHeight: 1
        }}>
          {isLoading ? '...' : loyaltyPrograms.length}
        </div>
        
        <div style={{ 
          fontSize: '0.75em', 
          color: colors.text.secondary,
          textAlign: 'center'
        }}>
          Active programs
        </div>
      </div>
    </DashboardCard>
  );
}; 