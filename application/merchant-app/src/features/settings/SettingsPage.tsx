import { useState, useEffect } from 'react';
import { MerchantUserDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';
import { useAppSelector } from '@/store/hooks';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Users, Settings as SettingsIcon, MapPin, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const { merchant } = useAppSelector((state) => state.merchant);
  const [users, setUsers] = useState<MerchantUserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (merchant?.id) {
      loadMerchantUsers();
    }
  }, [merchant?.id]);

  const loadMerchantUsers = async () => {
    if (!merchant?.id) return;

    try {
      setIsLoading(true);
      const merchantUsers = await apiClient.getMerchantUsers(merchant.id);
      setUsers(merchantUsers);
    } catch (error: any) {
      console.error('Failed to load merchant users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'STAFF':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (text: string) => {
    return text.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        {/* Merchant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Merchant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={merchant?.logoUrl} alt={merchant?.name} />
                <AvatarFallback className="text-lg font-semibold">
                  {merchant?.name ? getInitials(merchant.name) : 'M'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{merchant?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  @{merchant?.slug}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-sm">{merchant?.address || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {merchant?.createdAt ? formatDate(merchant.createdAt) : 'Unknown'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
              <Badge variant="secondary">{users.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No team members found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="font-semibold">
                        {getInitials(user.login)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{user.login}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {formatDate(user.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Updated {formatDate(user.updatedAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}