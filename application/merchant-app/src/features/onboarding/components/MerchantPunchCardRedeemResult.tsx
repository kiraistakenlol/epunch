import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import { MerchantDto, LoyaltyProgramDto } from 'e-punch-common-core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Gift, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

interface MerchantPunchCardRedeemResultProps {
  merchant: MerchantDto;
  loyaltyProgram?: LoyaltyProgramDto;
  className?: string;
}

export const MerchantPunchCardRedeemResult: React.FC<MerchantPunchCardRedeemResultProps> = ({
  merchant,
  loyaltyProgram,
  className = ''
}) => {
  const { t } = useI18n('merchantOnboarding');
  const programName = loyaltyProgram?.name || `${merchant.name} Rewards`;
  const rewardDescription = loyaltyProgram?.rewardDescription || t('merchantInterface.redeemResult.defaultReward');

  return (
    <div className={cn("p-2 sm:p-4 max-h-[90vh] flex flex-col w-full", className)}>
      <Card className="flex-1 flex flex-col w-full">
        <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="flex items-center justify-center space-x-3 mb-2 sm:mb-3">
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <Badge variant="default" className="text-xs sm:text-sm px-2 sm:px-3 py-1">{t('merchantInterface.redeemResult.badge')}</Badge>
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center">{t('merchantInterface.redeemResult.title')}</CardTitle>
          <p className="text-xs sm:text-sm text-center text-muted-foreground">{t('merchantInterface.redeemResult.cardId', { cardId: 'card123...' })}</p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="flex-1 flex flex-col space-y-2 sm:space-y-3">
            <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">{programName}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base">🎁</span>
                <p className="text-xs sm:text-sm text-muted-foreground">{rewardDescription}</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700">
                <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">{t('merchantInterface.redeemResult.readyToRedeem')}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4 mt-auto flex-shrink-0">
            <Button 
              variant="outline" 
              className="w-1/2 h-12 sm:h-14 text-sm sm:text-base flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              {t('merchantInterface.redeemResult.backButton')}
            </Button>
            
            <Button 
              className="w-1/2 h-12 sm:h-14 text-sm sm:text-base flex items-center justify-center"
            >
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              {t('merchantInterface.redeemResult.redeemButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 