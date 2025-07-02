import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { apiClient } from 'e-punch-common-ui';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { LoyaltyProgramsCard } from './LoyaltyProgramsCard';
import { ScannerCard } from './ScannerCard';
import { DashboardStatsGrid } from './DashboardStatsGrid';

export function V2DashboardPage() {
  const merchantId = useAppSelector(state => state.merchant.merchant?.id);
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

  return (
    <div className="flex flex-col gap-4">
      <DashboardStatsGrid 
        activeProgramsCount={loyaltyPrograms.length}
        isLoading={isLoading}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <LoyaltyProgramsCard />
        <ScannerCard />
      </div>
    </div>
  );
} 