import { LoyaltyProgramsCard } from './LoyaltyProgramsCard';
import { ScannerCard } from './ScannerCard';
import { DashboardStatsGrid } from './DashboardStatsGrid';
import { PageContainer } from '@/components/shared/layout/PageContainer';

export function DashboardPage() {

  return (
    <PageContainer>
      <div className="flex flex-col gap-4">
        <DashboardStatsGrid />
        <div className="grid grid-cols-2 gap-4">
          <ScannerCard />
          <LoyaltyProgramsCard />
        </div>
      </div>
    </PageContainer>
  );
} 