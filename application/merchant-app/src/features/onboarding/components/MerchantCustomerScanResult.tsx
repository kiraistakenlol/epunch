import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Gift, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

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
    <div className={cn("p-2 sm:p-4 max-h-[90vh] flex flex-col w-full", className)}>
      <Card className="flex-1 flex flex-col w-full">
        <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="flex items-center justify-center space-x-3 mb-2 sm:mb-3">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">{t('merchantInterface.customerScan.badge')}</Badge>
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center">{t('merchantInterface.customerScan.title')}</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="flex-1 flex flex-col space-y-2 sm:space-y-3">
            <div className="p-3 sm:p-4 rounded-lg border-2 border-primary bg-primary/5">
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <span className="text-sm sm:text-base">🎁</span>
                <h3 className="font-medium text-sm sm:text-base">{loyaltyProgram.name}</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                {loyaltyProgram.rewardDescription}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t('merchantInterface.customerScan.current', { current: currentPunches, total: totalPunches })}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4 mt-auto flex-shrink-0">
            <Button 
              variant="outline" 
              className="w-1/2 h-12 sm:h-14 text-sm sm:text-base flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              {t('merchantInterface.customerScan.backButton')}
            </Button>
            
            <Button 
              className="w-1/2 h-12 sm:h-14 text-sm sm:text-base flex items-center justify-center"
            >
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              {t('merchantInterface.customerScan.punchButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 