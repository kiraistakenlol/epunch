import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, CreditCard, Mail, Shield, Gift } from 'lucide-react';
import { apiClient } from 'e-punch-common-ui';
import { UserDto, PunchCardDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { ROUTES } from '@/lib/cn';
import { toast } from 'sonner';

interface GroupedPunchCards {
  loyaltyProgramId: string;
  loyaltyProgramName: string;
  loyaltyProgramDescription?: string;
  cards: PunchCardDto[];
}

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const merchantId = useAppSelector((state) => state.merchant.merchant?.id);
  
  const [customer, setCustomer] = useState<UserDto | null>(null);
  const [punchCards, setPunchCards] = useState<PunchCardDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && merchantId) {
      loadCustomerData();
    }
  }, [id, merchantId]);

  const loadCustomerData = async () => {
    if (!id || !merchantId) return;

    try {
      setLoading(true);
      const [customerData, punchCardsData] = await Promise.all([
        apiClient.getMerchantCustomer(merchantId, id),
        apiClient.getMerchantCustomerPunchCards(merchantId, id)
      ]);
      
      setCustomer(customerData);
      setPunchCards(punchCardsData);
    } catch (error: any) {
      console.error('Failed to load customer data:', error);
      toast.error(error.message || 'Failed to load customer data');
      navigate(ROUTES.CUSTOMERS);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REWARD_READY':
        return 'bg-green-100 text-green-800';
      case 'REWARD_REDEEMED':
        return 'bg-gray-100 text-gray-800';
      case 'ACTIVE':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'REWARD_READY':
        return 'Reward Ready';
      case 'REWARD_REDEEMED':
        return 'Redeemed';
      case 'ACTIVE':
      default:
        return 'Active';
    }
  };

  // Group punch cards by loyalty program
  const groupedPunchCards: GroupedPunchCards[] = punchCards.reduce((groups, card) => {
    const existingGroup = groups.find((group: GroupedPunchCards) => group.loyaltyProgramId === card.loyaltyProgramId);
    
    if (existingGroup) {
      existingGroup.cards.push(card);
    } else {
      groups.push({
        loyaltyProgramId: card.loyaltyProgramId,
        loyaltyProgramName: card.loyaltyProgramName || 'Unknown Program',
        loyaltyProgramDescription: card.loyaltyProgramDescription,
        cards: [card]
      });
    }
    
    return groups;
  }, [] as GroupedPunchCards[]);

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!customer) {
    return (
      <PageContainer>
        <Card>
          <CardHeader>
            <CardTitle>Customer not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(ROUTES.CUSTOMERS)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Customers
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.CUSTOMERS)}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {customer.email || 'Anonymous Customer'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm break-all">
                  {customer.email || 'No email provided'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <Badge variant={customer.externalId ? 'default' : 'secondary'}>
                  {customer.externalId ? 'Registered' : 'Anonymous'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Joined: {formatDate(customer.createdAt)}
                </span>
              </div>
              
              {customer.externalId && (
                <div className="text-xs text-muted-foreground">
                  ID: {customer.externalId}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Punch Cards */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Loyalty Cards ({punchCards.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {groupedPunchCards.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No loyalty cards</h3>
                  <p className="text-muted-foreground">
                    This customer hasn't started any loyalty programs yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedPunchCards.map((group) => (
                    <div key={group.loyaltyProgramId} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">{group.loyaltyProgramName}</h4>
                        <Badge variant="outline">{group.cards.length} card{group.cards.length > 1 ? 's' : ''}</Badge>
                      </div>
                      
                      {group.loyaltyProgramDescription && (
                        <p className="text-sm text-muted-foreground pl-6">
                          {group.loyaltyProgramDescription}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                        {group.cards.map((card) => (
                          <div
                            key={card.id}
                            className="p-4 border rounded-lg space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {card.currentPunches} / {card.totalPunches} punches
                              </span>
                              <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(card.status)}`}>
                                {getStatusText(card.status)}
                              </div>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min((card.currentPunches / card.totalPunches) * 100, 100)}%`
                                }}
                              />
                            </div>
                            
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div>Created: {formatDate(card.createdAt)}</div>
                              {card.lastPunchAt && (
                                <div>Last punch: {formatDate(card.lastPunchAt)}</div>
                              )}
                              {card.completedAt && (
                                <div>Completed: {formatDate(card.completedAt)}</div>
                              )}
                              {card.redeemedAt && (
                                <div>Redeemed: {formatDate(card.redeemedAt)}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {group !== groupedPunchCards[groupedPunchCards.length - 1] && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}