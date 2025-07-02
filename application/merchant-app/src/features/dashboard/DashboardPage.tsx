import { LoyaltyProgramsCard } from './LoyaltyProgramsCard';
import { ScannerCard } from './ScannerCard';

export function DashboardPage() {

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ScannerCard />
        <LoyaltyProgramsCard />
      </div>
    </div>
  );
} 