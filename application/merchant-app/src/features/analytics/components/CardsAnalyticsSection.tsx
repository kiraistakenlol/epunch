import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { PieChartWithLegend } from './PieChartWithLegend';
import { apiClient } from 'e-punch-common-ui';
import { CardsAnalyticsDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

export function CardsAnalyticsSection() {
  const [data, setData] = useState<CardsAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const merchant = useAppSelector((state: RootState) => state.merchant.merchant);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cardsData = await apiClient.getCardsAnalytics(merchant!.id);
        setData(cardsData);
        setError(null);
      } catch (err) {
        setError('Failed to load cards analytics data');
        console.error('Error fetching cards analytics:', err);
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
        title="Cards"
        description="Current status breakdown of all loyalty cards in your system"
        icon={<CreditCard className="h-5 w-5" />}
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
        title="Cards"
        description="Current status breakdown of all loyalty cards in your system"
        icon={<CreditCard className="h-5 w-5" />}
        defaultExpanded={false}
      >
        <div className="text-red-600">
          {error || 'No data available'}
        </div>
      </CollapsibleSection>
    );
  }

  const cardsPieData = [
    { name: 'Active Cards', value: data.activeCards, color: '#3b82f6' },
    { name: 'Ready for Reward', value: data.rewardReadyCards, color: '#10b981' },
  ];

  return (
    <CollapsibleSection
      title="Cards"
      description="Current status breakdown of all loyalty cards in your system"
      icon={<CreditCard className="h-5 w-5" />}
      defaultExpanded={false}
    >
      <PieChartWithLegend
        pieData={cardsPieData}
      />
    </CollapsibleSection>
  );
} 