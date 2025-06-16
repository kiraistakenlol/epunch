import React from 'react';
import { 
  EpunchPage,
} from '../../components/foundational';
import { LoyaltyProgramsOverview } from './LoyaltyProgramsOverview';
import { QrCodeScannerOverview } from './QrCodeScannerOverview';
import './Dashboard.css';

export const DashboardPage: React.FC = () => {
  return (
    <EpunchPage title="Dashboard">
      <div className="dashboard-grid">
        <LoyaltyProgramsOverview />
        <QrCodeScannerOverview />
      </div>
    </EpunchPage>
  );
}; 