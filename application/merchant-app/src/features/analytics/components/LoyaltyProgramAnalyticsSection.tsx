import { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import { CollapsibleSection, ProgramOption } from './CollapsibleSection';
import { LoyaltyProgramCard, LoyaltyProgramData } from './LoyaltyProgramCard';
import { apiClient } from 'e-punch-common-ui';
import { LoyaltyProgramAnalyticsDto, ProgramStats } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

export function LoyaltyProgramAnalyticsSection() {
  const [loyaltyProgramFilter, setLoyaltyProgramFilter] = useState<string>('all');
  const [data, setData] = useState<LoyaltyProgramAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);

  const merchant = useAppSelector((state: RootState) => state.merchant.merchant);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!merchant?.id) return;
      
      try {
        const loyaltyPrograms = await apiClient.getMerchantLoyaltyPrograms(merchant.id);
        const programOptions: ProgramOption[] = loyaltyPrograms.map(program => ({
          id: program.id,
          name: program.name
        }));
        setPrograms(programOptions);
      } catch (err) {
        console.error('Error fetching loyalty programs:', err);
      }
    };

    fetchPrograms();
  }, [merchant?.id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!merchant?.id) return;
      
      try {
        setLoading(true);
        const loyaltyProgramData = await apiClient.getLoyaltyProgramAnalytics(merchant.id);
        setData(loyaltyProgramData);
        setError(null);
      } catch (err) {
        setError('Failed to load loyalty program analytics data');
        console.error('Error fetching loyalty program analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [merchant?.id]);

  if (loading) {
    return (
      <CollapsibleSection
        title="Loyalty Program Performance"
        description="Individual program analytics and completion insights"
        icon={<Gift className="h-5 w-5" />}
        infoTooltip="Detailed performance metrics for each loyalty program including completion rates and average time to complete."
        defaultExpanded={false}
        showProgramFilter={true}
        programFilter={loyaltyProgramFilter}
        onProgramFilterChange={setLoyaltyProgramFilter}
        programs={programs}
      >
        <div className="animate-pulse">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CollapsibleSection>
    );
  }

  if (error || !data) {
    return (
      <CollapsibleSection
        title="Loyalty Program Performance"
        description="Individual program analytics and completion insights"
        icon={<Gift className="h-5 w-5" />}
        infoTooltip="Detailed performance metrics for each loyalty program including completion rates and average time to complete."
        defaultExpanded={false}
        showProgramFilter={true}
        programFilter={loyaltyProgramFilter}
        onProgramFilterChange={setLoyaltyProgramFilter}
        programs={programs}
      >
        <div className="text-red-600">
          {error || 'No data available'}
        </div>
      </CollapsibleSection>
    );
  }

  const filteredProgramData = loyaltyProgramFilter === 'all'
    ? data.data
    : data.data.filter((p: ProgramStats) => p.loyaltyProgramId === loyaltyProgramFilter);

  return (
    <CollapsibleSection
      title="Loyalty Program Performance"
      description="Individual program analytics and completion insights"
      icon={<Gift className="h-5 w-5" />}
      infoTooltip="Detailed performance metrics for each loyalty program including completion rates and average time to complete."
      defaultExpanded={false}
      showProgramFilter={true}
      programFilter={loyaltyProgramFilter}
      onProgramFilterChange={setLoyaltyProgramFilter}
      programs={programs}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {filteredProgramData.map((program: ProgramStats) => (
          <LoyaltyProgramCard
            key={program.loyaltyProgramId}
            program={program as LoyaltyProgramData}
          />
        ))}
      </div>
    </CollapsibleSection>
  );
} 