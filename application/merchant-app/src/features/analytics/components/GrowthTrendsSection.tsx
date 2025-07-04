import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { CollapsibleSection, ProgramOption } from './CollapsibleSection';
import { GrowthTrendsChart } from './GrowthTrendsChart';
import { apiClient } from 'e-punch-common-ui';
import { GrowthTrendsDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { TimeUnit } from './shared';

export function GrowthTrendsSection() {
  const [growthTimeUnit, setGrowthTimeUnit] = useState<TimeUnit>('days');
  const [growthProgramFilter, setGrowthProgramFilter] = useState<string>('all');
  const [data, setData] = useState<GrowthTrendsDto | null>(null);
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
        const growthData = await apiClient.getGrowthTrends(
          merchant.id,
          growthTimeUnit,
          growthProgramFilter === 'all' ? undefined : growthProgramFilter
        );
        setData(growthData);
        setError(null);
      } catch (err) {
        setError('Failed to load growth trends data');
        console.error('Error fetching growth trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [merchant?.id, growthTimeUnit, growthProgramFilter]);

  const getSelectedProgramName = (programId: string) => {
    if (programId === 'all') return undefined;
    const program = programs.find(p => p.id === programId);
    return program?.name;
  };

  if (loading) {
    return (
      <CollapsibleSection
        title="Growth Trends"
        description="Cumulative growth metrics showing how totals increase over time"
        icon={<TrendingUp className="h-5 w-5" />}
        infoTooltip="Track how your total users, punches, and cards grow over time. Shows cumulative growth patterns to understand business expansion."
        defaultExpanded={false}
        showTimeUnit={true}
        timeUnit={growthTimeUnit}
        onTimeUnitChange={setGrowthTimeUnit}
        showProgramFilter={true}
        programFilter={growthProgramFilter}
        onProgramFilterChange={setGrowthProgramFilter}
        programs={programs}
      >
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </CollapsibleSection>
    );
  }

  if (error || !data) {
    return (
      <CollapsibleSection
        title="Growth Trends"
        description="Cumulative growth metrics showing how totals increase over time"
        icon={<TrendingUp className="h-5 w-5" />}
        infoTooltip="Track how your total users, punches, and cards grow over time. Shows cumulative growth patterns to understand business expansion."
        defaultExpanded={false}
        showTimeUnit={true}
        timeUnit={growthTimeUnit}
        onTimeUnitChange={setGrowthTimeUnit}
        showProgramFilter={true}
        programFilter={growthProgramFilter}
        onProgramFilterChange={setGrowthProgramFilter}
        programs={programs}
      >
        <div className="text-red-600">
          {error || 'No data available'}
        </div>
      </CollapsibleSection>
    );
  }

  return (
    <CollapsibleSection
      title="Growth Trends"
      description="Cumulative growth metrics showing how totals increase over time"
      icon={<TrendingUp className="h-5 w-5" />}
      infoTooltip="Track how your total users, punches, and cards grow over time. Shows cumulative growth patterns to understand business expansion."
      defaultExpanded={false}
      showTimeUnit={true}
      timeUnit={growthTimeUnit}
      onTimeUnitChange={setGrowthTimeUnit}
      showProgramFilter={true}
      programFilter={growthProgramFilter}
      onProgramFilterChange={setGrowthProgramFilter}
      programs={programs}
    >
      <GrowthTrendsChart
        data={data.data}
        timeUnit={growthTimeUnit}
        programName={getSelectedProgramName(growthProgramFilter)}
      />
    </CollapsibleSection>
  );
} 