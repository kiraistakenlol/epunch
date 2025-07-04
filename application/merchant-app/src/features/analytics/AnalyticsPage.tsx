import {
  AnalyticsHeader,
  QuickOverviewSection,
  UsersAnalyticsSection,
  CardsAnalyticsSection,
  GrowthTrendsSection,
  ActivityTrendsSection,
  DaysOfWeekAnalyticsSection,
  LoyaltyProgramAnalyticsSection
} from './components';
import { PageContainer } from '@/components/shared/layout/PageContainer';

export function AnalyticsPage() {
  return (
    <PageContainer>
        <AnalyticsHeader />

        <QuickOverviewSection />

        <UsersAnalyticsSection />

        <CardsAnalyticsSection />

        <GrowthTrendsSection />

        <ActivityTrendsSection />

        <DaysOfWeekAnalyticsSection />

        <LoyaltyProgramAnalyticsSection />
    </PageContainer>
  );
} 