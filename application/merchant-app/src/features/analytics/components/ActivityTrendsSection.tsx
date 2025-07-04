import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { CollapsibleSection, ProgramOption } from './CollapsibleSection';
import { ActivityTrendsChart } from './DailyActivityChart';
import { apiClient } from 'e-punch-common-ui';
import { ActivityTrendsDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { TimeUnit } from './shared';

export function ActivityTrendsSection() {
  const [chartTimeUnit, setChartTimeUnit] = useState<TimeUnit>('days');
  const [chartProgramFilter, setChartProgramFilter] = useState<string>('all');
  const [data, setData] = useState<ActivityTrendsDto | null>(null);
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
        const activityData = await apiClient.getActivityTrends(
          merchant.id,
          chartTimeUnit,
          chartProgramFilter === 'all' ? undefined : chartProgramFilter
        );
        setData(activityData);
        setError(null);
      } catch (err) {
        setError('Failed to load activity trends data');
        console.error('Error fetching activity trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [merchant?.id, chartTimeUnit, chartProgramFilter]);

  const getSelectedProgramName = (programId: string) => {
    if (programId === 'all') return undefined;
    const program = programs.find(p => p.id === programId);
    return program?.name;
  };

  if (loading) {
    return (
      <CollapsibleSection
        title="Activity Trends"
        description="Interactive activity trends with time period and program filtering"
        icon={<TrendingUp className="h-5 w-5" />}
        infoTooltip="Track customer activity including punches, new customers, and rewards redeemed over different time periods."
        defaultExpanded={false}
        showTimeUnit={true}
        timeUnit={chartTimeUnit}
        onTimeUnitChange={setChartTimeUnit}
        showProgramFilter={true}
        programFilter={chartProgramFilter}
        onProgramFilterChange={setChartProgramFilter}
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
        title="Activity Trends"
        description="Interactive activity trends with time period and program filtering"
        icon={<TrendingUp className="h-5 w-5" />}
        infoTooltip="Track customer activity including punches, new customers, and rewards redeemed over different time periods."
        defaultExpanded={false}
        showTimeUnit={true}
        timeUnit={chartTimeUnit}
        onTimeUnitChange={setChartTimeUnit}
        showProgramFilter={true}
        programFilter={chartProgramFilter}
        onProgramFilterChange={setChartProgramFilter}
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
      title="Activity Trends"
      description="Interactive activity trends with time period and program filtering"
      icon={<TrendingUp className="h-5 w-5" />}
      infoTooltip="Track customer activity including punches, new customers, and rewards redeemed over different time periods."
      defaultExpanded={false}
      showTimeUnit={true}
      timeUnit={chartTimeUnit}
      onTimeUnitChange={setChartTimeUnit}
      showProgramFilter={true}
      programFilter={chartProgramFilter}
      onProgramFilterChange={setChartProgramFilter}
      programs={programs}
    >
      <ActivityTrendsChart
        data={data.data}
        timeUnit={chartTimeUnit}
        programName={getSelectedProgramName(chartProgramFilter)}
      />
    </CollapsibleSection>
  );
} 