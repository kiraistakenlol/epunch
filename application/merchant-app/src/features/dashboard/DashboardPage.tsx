import { LoyaltyProgramsCard } from './LoyaltyProgramsCard';
import { ScannerCard } from './ScannerCard';
import { QRCodeCard } from './QRCodeCard';
import { DashboardStatsGrid } from './DashboardStatsGrid';
import { PageContainer } from '@/components/shared/layout/PageContainer';

export function DashboardPage() {

  return (
    <PageContainer>
      <div className="flex flex-col gap-4">
        <DashboardStatsGrid />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ScannerCard />
          <LoyaltyProgramsCard />
          <QRCodeCard />
        </div>
      </div>
    </PageContainer>
  );
} 