import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { PunchCardDto } from 'e-punch-common-core';
import { ManagementSection } from './ManagementSection';
import { ActionCard } from './ActionCard';
import { PunchCardsTable } from './punch-cards/PunchCardsTable';
import { AddPunchModal } from './punch-cards/AddPunchModal';

interface PunchCardsManagementSectionProps {
  punchCards: PunchCardDto[];
  formatDate: (dateString: string | undefined | null) => string;
  customerId: string;
  onDataRefresh: () => void;
}

export function PunchCardsManagementSection({ 
  punchCards, 
  formatDate,
  customerId,
  onDataRefresh
}: PunchCardsManagementSectionProps) {
  const [showAddPunchModal, setShowAddPunchModal] = useState(false);

  const handleGivePunch = () => {
    setShowAddPunchModal(true);
  };

  const handlePunchSuccess = () => {
    onDataRefresh(); // Refresh the data after successful punch
  };

  const renderPunchCards = () => (
    <PunchCardsTable data={punchCards} formatDate={formatDate} />
  );

  const renderActions = () => (
    <div className="grid grid-cols-1 max-w-md">
      <ActionCard
        icon={CreditCard}
        title="Add Punch"
        description="Add a punch to this customer's loyalty cards"
        buttonText="Add Punch"
        disabled={false}
        onClick={handleGivePunch}
      />
    </div>
  );

  return (
    <>
      <ManagementSection
        icon={CreditCard}
        title="Punch Cards"
        description="View and manage customer's loyalty punch cards"
        count={punchCards.length}
        emptyStateTitle="No punch cards"
        emptyStateDescription="This customer hasn't started any loyalty programs yet."
        actions={renderActions()}
      >
        {renderPunchCards()}
      </ManagementSection>

      <AddPunchModal
        open={showAddPunchModal}
        onOpenChange={setShowAddPunchModal}
        customerId={customerId}
        onSuccess={handlePunchSuccess}
      />
    </>
  );
} 