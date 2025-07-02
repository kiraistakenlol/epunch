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
    <div className={cn("p-2 h-full", className)}>
      <Card className="h-full text-xs">
        <CardHeader className="pb-3 px-3 py-3">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <Badge variant="default" className="text-xs px-2 py-0">{t('merchantInterface.redeemResult.badge')}</Badge>
          </div>
          <CardTitle className="text-sm text-center">{t('merchantInterface.redeemResult.title')}</CardTitle>
          <p className="text-xs text-center text-muted-foreground">{t('merchantInterface.redeemResult.cardId', { cardId: 'card123...' })}</p>
        </CardHeader>
        
        <CardContent className="space-y-3 px-3 py-2">
          <div className="p-3 bg-muted/50 rounded">
            <h4 className="font-medium text-xs mb-1">{programName}</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm">🎁</span>
              <p className="text-xs text-muted-foreground">{rewardDescription}</p>
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center space-x-2 text-green-700">
              <Gift className="h-3 w-3" />
              <span className="text-xs font-medium">{t('merchantInterface.redeemResult.readyToRedeem')}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1 h-10 text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              {t('merchantInterface.redeemResult.backButton')}
            </Button>
            
            <Button 
              className="flex-1 h-10 text-xs"
            >
              <Gift className="w-3 h-3 mr-1" />
              {t('merchantInterface.redeemResult.redeemButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 