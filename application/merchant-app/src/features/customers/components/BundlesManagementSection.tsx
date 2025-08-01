import { useState } from 'react';
import { BundleDto } from 'e-punch-common-core';
import { Package, Plus } from 'lucide-react';
import { ManagementSection } from './ManagementSection';
import { ActionCard } from './ActionCard';
import { BundlesTable } from './bundles/BundlesTable';
import { GiveBundleModal } from './bundles/GiveBundleModal';
import { UpdateBundleModal } from './bundles/UpdateBundleModal';
import { toast } from 'sonner';

interface BundlesManagementSectionProps {
  bundles: BundleDto[];
  customerId: string;
  onDataRefresh: () => void;
  formatDate: (dateString: string | undefined | null) => string;
}

export function BundlesManagementSection({ 
  bundles, 
  customerId, 
  onDataRefresh,
  formatDate 
}: BundlesManagementSectionProps) {
  const [showGiveBundleModal, setShowGiveBundleModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<BundleDto | null>(null);

  const handleGiveBundle = () => {
    setShowGiveBundleModal(true);
  };

  const handleUpdateBundle = (bundleId: string) => {
    const bundle = bundles.find(b => b.id === bundleId);
    if (bundle) {
      setSelectedBundle(bundle);
      setShowUpdateModal(true);
    }
  };

  const handleDeleteBundle = (bundleId: string) => {
    // TODO: Implement delete bundle functionality
    toast.info('Delete Bundle functionality coming soon!');
    console.log('Delete bundle:', bundleId);
  };

  const handleGiveBundleSuccess = () => {
    onDataRefresh();
  };

  const handleUpdateSuccess = () => {
    onDataRefresh();
    setSelectedBundle(null);
  };

  const renderBundles = () => {
    if (bundles.length === 0) {
      return null;
    }

    return (
      <BundlesTable 
        data={bundles} 
        formatDate={formatDate}
        onUpdateBundle={handleUpdateBundle}
        onDeleteBundle={handleDeleteBundle}
      />
    );
  };

  const renderActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ActionCard
        icon={Plus}
        title="Give Bundle" 
        description="Add a new bundle for this customer"
        buttonText="Give Bundle"
        onClick={handleGiveBundle}
      />
    </div>
  );

  return (
    <>
      <ManagementSection
        icon={Package}
        title="Bundles"
        description="Manage customer's bundle products"
        count={bundles.length}
        emptyStateTitle="No bundles found"
        emptyStateDescription="This customer doesn't have any bundles yet. You can give them a bundle to get started."
        actions={renderActions()}
      >
        {renderBundles()}
      </ManagementSection>

      <GiveBundleModal
        open={showGiveBundleModal}
        onOpenChange={setShowGiveBundleModal}
        customerId={customerId}
        onSuccess={handleGiveBundleSuccess}
      />

      <UpdateBundleModal
        open={showUpdateModal}
        onOpenChange={setShowUpdateModal}
        bundle={selectedBundle}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
} 