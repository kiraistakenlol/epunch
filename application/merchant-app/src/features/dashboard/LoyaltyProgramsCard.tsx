import { useNavigate } from 'react-router-dom';
import { CreditCard, Plus } from 'lucide-react';
import { QuickActionCard } from './QuickActionCard';
import { ROUTES } from '@/lib/cn';

export function LoyaltyProgramsCard() {
  const navigate = useNavigate();

  return (
    <QuickActionCard
      icon={<CreditCard className="w-full h-full text-primary" />}
      title="Loyalty Programs"
      onClick={() => navigate(ROUTES.LOYALTY_PROGRAMS)}
      secondaryAction={{
        icon: <Plus className="h-4 w-4" />,
        onClick: (e) => {
          e.stopPropagation();
          navigate(ROUTES.LOYALTY_PROGRAMS_CREATE);
        }
      }}
    />
  );
} 