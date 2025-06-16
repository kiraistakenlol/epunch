import React from 'react';
import { 
  EpunchPage,
  EpunchSmartGrid,
  EpunchCard,
} from '../../components/foundational';
import { LoyaltyProgramsOverview } from './LoyaltyProgramsOverview';
import { QrCodeScannerOverview } from './QrCodeScannerOverview';

export const Dashboard: React.FC = () => {
  return (
    <EpunchPage title="Merchant Dashboard">
      <EpunchSmartGrid>
        <EpunchCard>
          <LoyaltyProgramsOverview />
        </EpunchCard>
        <EpunchCard>
          <QrCodeScannerOverview />
        </EpunchCard>
      </EpunchSmartGrid>
    </EpunchPage>
  );
}; 