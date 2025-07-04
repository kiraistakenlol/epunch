import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { CollapsibleSection, ProgramOption } from './CollapsibleSection';
import { DaysOfWeekChart } from './DaysOfWeekChart';
import { apiClient } from 'e-punch-common-ui';
import { DaysOfWeekAnalyticsDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

export function DaysOfWeekAnalyticsSection() {
  const [chartProgramFilter, setChartProgramFilter] = useState<string>('all');
  const [data, setData] = useState<DaysOfWeekAnalyticsDto | null>(null);
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
        const daysOfWeekData = await apiClient.getDaysOfWeekAnalytics(
          merchant.id,
          chartProgramFilter === 'all' ? undefined : chartProgramFilter
        );
        setData(daysOfWeekData);
        setError(null);
      } catch (err) {
        setError('Failed to load days of week analytics data');
        console.error('Error fetching days of week analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [merchant?.id, chartProgramFilter]);

  const getSelectedProgramName = (programId: string) => {
    if (programId === 'all') return undefined;
    const program = programs.find(p => p.id === programId);
    return program?.name;
  };

  if (loading) {
    return (
      <CollapsibleSection
        title="Days of Week Activity"
        description="Weekly activity patterns and peak business day insights"
        icon={<Calendar className="h-5 w-5" />}
        infoTooltip="Analyze activity patterns across different days of the week to identify peak business periods and optimize staffing."
        defaultExpanded={false}
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
        title="Days of Week Activity"
        description="Weekly activity patterns and peak business day insights"
        icon={<Calendar className="h-5 w-5" />}
        infoTooltip="Analyze activity patterns across different days of the week to identify peak business periods and optimize staffing."
        defaultExpanded={false}
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
      title="Days of Week Activity"
      description="Weekly activity patterns and peak business day insights"
      icon={<Calendar className="h-5 w-5" />}
      infoTooltip="Analyze activity patterns across different days of the week to identify peak business periods and optimize staffing."
      defaultExpanded={false}
      showProgramFilter={true}
      programFilter={chartProgramFilter}
      onProgramFilterChange={setChartProgramFilter}
      programs={programs}
    >
      <DaysOfWeekChart 
        data={data.data}
        programName={getSelectedProgramName(chartProgramFilter)} 
      />
    </CollapsibleSection>
  );
} 