import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MerchantPageMockupProps {
  children?: React.ReactNode;
  className?: string;
}

export const MerchantPageMockup: React.FC<MerchantPageMockupProps> = ({
  children,
  className
}) => {
  return (
    <Card className={cn("w-full max-w-sm mx-auto bg-background border-2", className)}>
      {/* Merchant app header */}
      <div className="bg-primary text-primary-foreground p-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-foreground rounded-full" />
            <span className="text-sm font-medium">Merchant App</span>
          </div>
          <div className="w-6 h-6 bg-primary-foreground/20 rounded" />
        </div>
      </div>
      
      {/* Content area */}
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}; 