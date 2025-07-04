import { useState, useEffect } from 'react';
import { TrendingUp, Users, CreditCard, Zap, Gift } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import { CompactMetricsGrid } from './CompactMetricsGrid';
import { apiClient } from 'e-punch-common-ui';
import { QuickOverviewDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

export function QuickOverviewSection() {
  const [data, setData] = useState<QuickOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const merchant = useAppSelector((state: RootState) => state.merchant.merchant);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const overview = await apiClient.getQuickOverview(merchant!.id);
        setData(overview);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Error fetching quick overview:', err);
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 border">
        <div className="text-red-600">
          {error || 'No data available'}
        </div>
      </div>
    );
  }

  const compactMetrics = [
    {
      icon: <Users className="h-6 w-6" />,
      value: data.totalUsers.toLocaleString(),
      label: 'Total Users',
      colorClass: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700',
      growth: {
        percentage: Math.abs(data.totalUsersGrowth),
        isPositive: data.totalUsersGrowth >= 0
      }
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      value: data.totalCards.toLocaleString(),
      label: 'Total Cards',
      colorClass: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700',
      growth: {
        percentage: Math.abs(data.totalCardsGrowth),
        isPositive: data.totalCardsGrowth >= 0
      }
    },
    {
      icon: <Zap className="h-6 w-6" />,
      value: data.totalPunches.toLocaleString(),
      label: 'Total Punches',
      colorClass: 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700',
      growth: {
        percentage: Math.abs(data.totalPunchesGrowth),
        isPositive: data.totalPunchesGrowth >= 0
      }
    },
    {
      icon: <Gift className="h-6 w-6" />,
      value: data.rewardsRedeemed.toLocaleString(),
      label: 'Rewards',
      colorClass: 'bg-gradient-to-br from-green-50 to-green-100 text-green-700',
      growth: {
        percentage: Math.abs(data.rewardsRedeemedGrowth),
        isPositive: data.rewardsRedeemedGrowth >= 0
      }
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 border">
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Quick Overview
          <InfoTooltip content="Essential metrics for your loyalty program with month-over-month growth." />
        </h2>
        <p className="text-sm text-muted-foreground">
          Key performance indicators
        </p>
      </div>
      
      <CompactMetricsGrid metrics={compactMetrics} />
      
      <p className="text-xs text-muted-foreground/80 mt-3 text-center">
        Growth comparing with last month
      </p>
    </div>
  );
} 