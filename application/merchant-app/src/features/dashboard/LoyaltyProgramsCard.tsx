import { useNavigate } from 'react-router-dom';
import { CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/shared/data-display/DashboardCard';
import { ROUTES } from '@/lib/cn';

export function LoyaltyProgramsCard() {
  const navigate = useNavigate();

  return (
    <DashboardCard
      title="Loyalty Programs"
      description="Create, view, and manage your loyalty programs."
      className="col-span-1"
      footer={
        <div className="flex justify-between w-full items-center">
          <Button onClick={() => navigate(ROUTES.LOYALTY_PROGRAMS)}>View All</Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // This should navigate to the create page when it's built
              // navigate(V2_ROUTES.LOYALTY_PROGRAMS_CREATE) 
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-center h-full">
        <CreditCard className="h-12 w-12 text-muted-foreground" />
      </div>
    </DashboardCard>
  );
} 