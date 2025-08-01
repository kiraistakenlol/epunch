import { UserDto } from 'e-punch-common-core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CustomerInfoSectionProps {
  customer: UserDto;
  formatDate: (dateString: string | undefined | null) => string;
}

export function CustomerInfoSection({ customer, formatDate }: CustomerInfoSectionProps) {
  const getInitials = (email: string | undefined | null) => {
    if (!email) return 'A';
    return email.charAt(0).toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(customer.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-semibold">
              {customer.email || 'Anonymous Customer'}
            </h2>
            <p className="text-xs text-muted-foreground">Customer Details</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">ID: </span>
          <span>{customer.id}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Email: </span>
          <span>{customer.email || '-'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">External ID: </span>
          <span>{customer.externalId || '-'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Joined: </span>
          <span>{formatDate(customer.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
} 