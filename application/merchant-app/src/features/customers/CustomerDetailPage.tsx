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

interface GroupedPunchCards {
  loyaltyProgramId: string;
  loyaltyProgramName: string;
  loyaltyProgramDescription: string;
  rewardDescription: string;
  cards: PunchCardDto[];
}

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const merchantId = useAppSelector((state) => state.merchant.merchant?.id);
  
  const [customer, setCustomer] = useState<UserDto | null>(null);
  const [punchCards, setPunchCards] = useState<PunchCardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerData = async () => {
    if (!merchantId || !id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [customerData, punchCardsData] = await Promise.all([
        apiClient.getMerchantCustomer(merchantId, id),
        apiClient.getMerchantCustomerPunchCards(merchantId, id)
      ]);
      
      setCustomer(customerData);
      setPunchCards(punchCardsData);
    } catch (err) {
      setError('Failed to fetch customer data');
      console.error('Error fetching customer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [merchantId, id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800';
      case 'REWARD_READY':
        return 'bg-green-100 text-green-800';
      case 'REWARD_REDEEMED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'REWARD_READY':
        return 'Reward Ready';
      case 'REWARD_REDEEMED':
        return 'Redeemed';
      default:
        return status;
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
        loyaltyProgramName: card.loyaltyProgramName || card.shopName,
        loyaltyProgramDescription: card.loyaltyProgramDescription || card.shopAddress,
        rewardDescription: card.rewardDescription || 'Reward available',
        cards: [card]
      });
    }
    
    return groups;
  }, [] as GroupedPunchCards[]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
          <div>
            <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
            <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-4 sm:p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/customers')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Customer not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/customers')}
          className="self-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="break-all">{customer.email || 'Anonymous Customer'}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Customer details and activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
              </div>
              <span className="break-all">{customer.email || 'Not provided'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Account Type:</span>
              </div>
              <Badge variant={customer.externalId ? 'default' : 'secondary'}>
                {customer.externalId ? 'Registered' : 'Anonymous'}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Joined:</span>
              </div>
              <span>{formatDate(customer.createdAt)}</span>
            </div>
            {customer.superAdmin && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Super Admin:</span>
                </div>
                <Badge variant="destructive">Yes</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Loyalty Programs:</span>
              <span>{groupedPunchCards.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Punch Cards:</span>
              <span>{punchCards.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Active Cards:</span>
              <span>{punchCards.filter(card => card.status === 'ACTIVE').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Rewards Ready:</span>
              <span>{punchCards.filter(card => card.status === 'REWARD_READY').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Rewards Redeemed:</span>
              <span>{punchCards.filter(card => card.status === 'REWARD_REDEEMED').length}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-medium">Total Punches:</span>
              <span>{punchCards.reduce((sum, card) => sum + card.currentPunches, 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {groupedPunchCards.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No punch cards</h3>
            <p className="text-muted-foreground">
              This customer hasn't created any punch cards with your business yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedPunchCards.map((group) => (
            <Card key={group.loyaltyProgramId}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
                      {group.loyaltyProgramName}
                    </CardTitle>
                    {group.loyaltyProgramDescription && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {group.loyaltyProgramDescription}
                      </p>
                    )}
                    <p className="text-sm font-medium text-primary mt-2">
                      🎁 {group.rewardDescription}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {group.cards.length} card{group.cards.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.cards.map((card) => (
                    <div
                      key={card.id}
                      className="border rounded-lg p-4 hover:bg-muted/25 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <Badge className={getStatusColor(card.status)}>
                              {getStatusText(card.status)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Created: {formatDate(card.createdAt)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <span>Punches: {card.currentPunches}/{card.totalPunches}</span>
                            {card.lastPunchAt && (
                              <span className="hidden sm:inline">Last punch: {formatDateTime(card.lastPunchAt)}</span>
                            )}
                          </div>
                          {card.lastPunchAt && (
                            <div className="sm:hidden text-sm text-muted-foreground mt-1">
                              Last punch: {formatDateTime(card.lastPunchAt)}
                            </div>
                          )}
                        </div>
                        <div className="text-center sm:text-right">
                          <div className="text-xl sm:text-2xl font-bold text-primary">
                            {card.currentPunches}/{card.totalPunches}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((card.currentPunches / card.totalPunches) * 100)}% Complete
                          </div>
                        </div>
                      </div>
                      {card.completedAt && (
                        <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                          Completed: {formatDateTime(card.completedAt)}
                        </div>
                      )}
                      {card.redeemedAt && (
                        <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                          Redeemed: {formatDateTime(card.redeemedAt)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}