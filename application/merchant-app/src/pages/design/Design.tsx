import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { 
  EpunchPage, 
  EpunchCard,
  EpunchAlert,
  EpunchVerticalStack
} from '../../components/foundational';
import { 
  PunchCardStyleLogic, 
} from '../../components/shared';
import { apiClient } from 'e-punch-common-ui';
import { PunchCardStyleDto } from 'e-punch-common-core';

export const Design: React.FC = () => {
  const merchant = useAppSelector(state => state.auth.merchant);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [punchCardStyle, setPunchCardStyle] = useState<PunchCardStyleDto>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!merchant) return;
      
      setLoading(true);
      try {
        const styleResult = await apiClient.getMerchantDefaultPunchCardStyle(merchant.id);
        
        setPunchCardStyle({
          primaryColor: styleResult?.primaryColor || undefined,
          secondaryColor: styleResult?.secondaryColor || undefined,
          logoUrl: styleResult?.logoUrl || undefined
        });
        
        // Icon states remain with initial empty values for now
      } catch (err) {
        setError('Failed to load design data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [merchant]);

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  if (!merchant) {
    return (
      <EpunchPage title="Design">
        <EpunchAlert variant="error">
          Merchant not found
        </EpunchAlert>
      </EpunchPage>
    );
  }

  return (
    <EpunchPage title="Design" loading={loading} error={error}>
      {success && (
        <EpunchAlert variant="success">
          {success}
        </EpunchAlert>
      )}

      <EpunchVerticalStack >
        <EpunchCard>
          <PunchCardStyleLogic
            merchantId={merchant.id}
            initialStyle={punchCardStyle}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </EpunchCard>
      </EpunchVerticalStack>
    </EpunchPage>
  );
}; 