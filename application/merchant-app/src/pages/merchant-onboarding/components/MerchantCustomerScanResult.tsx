import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Gift, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MerchantCustomerScanResultProps {
  loyaltyProgram: LoyaltyProgramDto;
  className?: string;
}

export const MerchantCustomerScanResult: React.FC<MerchantCustomerScanResultProps> = ({
  loyaltyProgram,
  className = ''
}) => {
  const { t } = useI18n('merchantOnboarding');
  const currentPunches = Math.floor(loyaltyProgram.requiredPunches * 0.7);
  const totalPunches = loyaltyProgram.requiredPunches;

  return (
    <div className={cn("p-2 h-full flex flex-col", className)}>
      <Card className="flex-1 flex flex-col text-xs">
        <CardHeader className="pb-3 px-3 py-3">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <User className="h-4 w-4 text-primary" />
            <Badge variant="outline" className="text-xs px-2 py-0">{t('merchantInterface.customerScan.badge')}</Badge>
          </div>
          <CardTitle className="text-sm text-center">{t('merchantInterface.customerScan.title')}</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-3 px-3 py-2">
          <div className="flex-1">
            <div
              className={cn(
                "p-3 rounded border-2 border-primary bg-primary/5"
              )}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm">🎁</span>
                <h3 className="font-medium text-xs">{loyaltyProgram.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {loyaltyProgram.rewardDescription}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('merchantInterface.customerScan.current', { current: currentPunches, total: totalPunches })}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1 h-10 text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              {t('merchantInterface.customerScan.backButton')}
            </Button>
            
            <Button 
              className="flex-1 h-10 text-xs"
            >
              <Gift className="w-3 h-3 mr-1" />
              {t('merchantInterface.customerScan.punchButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 