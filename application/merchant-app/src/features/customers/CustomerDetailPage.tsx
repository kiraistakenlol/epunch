import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from 'e-punch-common-ui';
import { UserDto, PunchCardDto, BundleDto } from 'e-punch-common-core';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchLoyaltyPrograms, selectLoyaltyPrograms } from '@/store/loyaltyProgramsSlice';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { ROUTES } from '@/lib/cn';
import { toast } from 'sonner';
import { CustomerInfoSection } from './components/CustomerInfoSection';
import { PunchCardsManagementSection } from './components/PunchCardsManagementSection';
import { BundlesManagementSection } from './components/BundlesManagementSection';

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const merchantId = useAppSelector((state) => state.merchant.merchant?.id);
  const loyaltyPrograms = useAppSelector(selectLoyaltyPrograms);
  
  const [customer, setCustomer] = useState<UserDto | null>(null);
  const [punchCards, setPunchCards] = useState<PunchCardDto[]>([]);
  const [bundles, setBundles] = useState<BundleDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && merchantId) {
      loadCustomerData();
    }
  }, [id, merchantId]);

  useEffect(() => {
    if (merchantId && loyaltyPrograms.length === 0) {
      dispatch(fetchLoyaltyPrograms(merchantId));
    }
  }, [merchantId, loyaltyPrograms.length, dispatch]);

  const loadCustomerData = async () => {
    if (!id || !merchantId) return;

    try {
      setLoading(true);
      const [customerData, customerPunchCards, customerBundles] = await Promise.all([
        apiClient.getMerchantCustomer(merchantId, id),
        apiClient.getMerchantCustomerPunchCards(merchantId, id),
        apiClient.getMerchantCustomerBundles(merchantId, id)
      ]);
      
      setCustomer(customerData);
      setPunchCards(customerPunchCards);
      setBundles(customerBundles);
    } catch (error: any) {
      console.error('Failed to load customer data:', error);
      toast.error(error.message || 'Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          {/* Customer info skeleton */}
          <Skeleton className="h-48 w-full" />
          
          {/* Management sections skeleton */}
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (!customer) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Customer not found</h2>
          <p className="text-muted-foreground mb-4">
            The customer you're looking for doesn't exist or you don't have permission to view them.
          </p>
          <Button onClick={() => navigate(ROUTES.CUSTOMERS)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.CUSTOMERS)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </Button>
        </div>

        {/* Customer Information */}
        <CustomerInfoSection 
          customer={customer} 
          formatDate={formatDate} 
        />

        {/* Punch Cards Management */}
        <PunchCardsManagementSection
          punchCards={punchCards}
          formatDate={formatDate}
          customerId={id!}
          onDataRefresh={loadCustomerData}
        />

        {/* Bundles Management */}
        <BundlesManagementSection
          bundles={bundles}
          customerId={id!}
          onDataRefresh={loadCustomerData}
          formatDate={formatDate}
        />
      </div>
    </PageContainer>
  );
}