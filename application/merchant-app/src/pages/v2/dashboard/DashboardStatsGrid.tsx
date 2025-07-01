import { Activity, CreditCard, Users } from 'lucide-react';
import { StatsCard } from '@/components/v2/data-display/StatsCard';

interface DashboardStatsGridProps {
  activeProgramsCount: number;
  isLoading: boolean;
}

export function DashboardStatsGrid({ activeProgramsCount, isLoading }: DashboardStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Active Programs"
        value={isLoading ? '...' : activeProgramsCount}
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        description="Currently active"
      />
      <StatsCard
        title="Total Punches"
        value="-"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        description="Coming soon"
      />
      <StatsCard
        title="Active Customers"
        value="-"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Coming soon"
      />
      <StatsCard
        title="Rewards Redeemed"
        value="-"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Coming soon"
      />
    </div>
  );
} 