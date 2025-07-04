import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, Zap, Gift } from 'lucide-react';
import { apiClient } from 'e-punch-common-ui';
import { QuickOverviewDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { ROUTES } from '@/app/routes';

export function DashboardStatsGrid() {
  const [data, setData] = useState<QuickOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const merchant = useAppSelector((state: RootState) => state.merchant.merchant);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const overview = await apiClient.getQuickOverview(merchant!.id);
        setData(overview);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
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
      <div className="bg-white rounded-lg p-4 border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-4 border">
        <div className="text-gray-500 text-sm">Stats unavailable</div>
      </div>
    );
  }

  const stats = [
    {
      icon: <Users className="h-4 w-4" />,
      value: data.totalUsers.toLocaleString(),
      label: 'Users',
      colorClass: 'bg-blue-50 text-blue-700',
      growth: data.totalUsersGrowth
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      value: data.totalCards.toLocaleString(),
      label: 'Cards',
      colorClass: 'bg-purple-50 text-purple-700',
      growth: data.totalCardsGrowth
    },
    {
      icon: <Zap className="h-4 w-4" />,
      value: data.totalPunches.toLocaleString(),
      label: 'Punches',
      colorClass: 'bg-orange-50 text-orange-700',
      growth: data.totalPunchesGrowth
    },
    {
      icon: <Gift className="h-4 w-4" />,
      value: data.rewardsRedeemed.toLocaleString(),
      label: 'Rewards',
      colorClass: 'bg-green-50 text-green-700',
      growth: data.rewardsRedeemedGrowth
    }
  ];

  return (
    <div 
      className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200"
      onClick={() => navigate(ROUTES.ANALYTICS)}
    >
      <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.colorClass} p-3 rounded-lg`}>
            <div className="flex items-center gap-2 mb-1">
              {stat.icon}
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <div className="text-lg font-bold">{stat.value}</div>
            {stat.growth !== 0 && (
              <div className={`text-xs ${stat.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.growth > 0 ? '↗' : '↘'} {Math.abs(stat.growth)}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 