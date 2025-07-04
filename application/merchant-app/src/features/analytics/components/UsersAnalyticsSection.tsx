import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { PieChartWithLegend } from './PieChartWithLegend';
import { apiClient } from 'e-punch-common-ui';
import { UsersAnalyticsDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

export function UsersAnalyticsSection() {
  const [data, setData] = useState<UsersAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const merchant = useAppSelector((state: RootState) => state.merchant.merchant);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersData = await apiClient.getUsersAnalytics(merchant!.id);
        setData(usersData);
        setError(null);
      } catch (err) {
        setError('Failed to load users analytics data');
        console.error('Error fetching users analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (merchant?.id) {
      fetchData();
    }
  }, [merchant?.id]);

  if (loading) {
    return (
      <CollapsibleSection
        title="Users"
        description="Distribution of registered vs anonymous users interacting with your loyalty programs"
        icon={<Users className="h-5 w-5" />}
        defaultExpanded={false}
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
        title="Users"
        description="Distribution of registered vs anonymous users interacting with your loyalty programs"
        icon={<Users className="h-5 w-5" />}
        defaultExpanded={false}
      >
        <div className="text-red-600">
          {error || 'No data available'}
        </div>
      </CollapsibleSection>
    );
  }

  const usersPieData = [
    { name: 'Registered Users', value: data.registeredUsers, color: '#10b981' },
    { name: 'Anonymous Users', value: data.anonymousUsers, color: '#6b7280' },
  ];

  return (
    <CollapsibleSection
      title="Users"
      description="Distribution of registered vs anonymous users interacting with your loyalty programs"
      icon={<Users className="h-5 w-5" />}
      defaultExpanded={false}
    >
      <PieChartWithLegend
        pieData={usersPieData}
      />
    </CollapsibleSection>
  );
} 