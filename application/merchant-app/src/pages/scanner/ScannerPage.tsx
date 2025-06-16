import React, { useState } from 'react';
import { apiClient } from 'e-punch-common-ui';
import { QRValueDto } from 'e-punch-common-core';
import { EpunchPage, EpunchSpinner } from '../../components/foundational';
import { QRScanner } from './components/QRScanner.tsx';
import { CustomerScanResult } from './components/scan-result/customer-qr/CustomerScanResult.tsx';
import { ScanResultPunchCard } from './components/scan-result/punch-card-qr/ScanResultPunchCard.tsx';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import styles from './ScannerPage.module.css';

type ScannerState = 'scanning' | 'userQR' | 'punchCardQR' | 'processing';

interface QRScanResult {
    qrData: string;
    parsedData: QRValueDto;
}

const ScannerPage: React.FC = () => {
    const [currentState, setCurrentState] = useState<ScannerState>('scanning');
    const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
    
    const handleScanResult = (result: QRScanResult) => {
        setScanResult(result);
        
        if (result.parsedData.type === 'user_id') {
            setCurrentState('userQR');
        } else if (result.parsedData.type === 'redemption_punch_card_id') {
            setCurrentState('punchCardQR');
        }
    };

    const handleError = (error: string) => {
        showErrorToast(error);
    };

    const handleReset = () => {
        setCurrentState('scanning');
        setScanResult(null);
    };

    const handlePunch = async (loyaltyProgramId: string) => {
        if (!scanResult?.parsedData || scanResult.parsedData.type !== 'user_id') return;

        setCurrentState('processing');

        try {
            const result = await apiClient.recordPunch(scanResult.parsedData.user_id, loyaltyProgramId);
            showSuccessToast(result.rewardAchieved ? "Reward Achieved!" : "Great.");
            
            setTimeout(() => handleReset(), 2000);
        } catch (error: any) {
            console.error('Punch operation error:', error);
            showErrorToast(error.response?.data?.message || error.message || 'Punch operation failed.');
            setTimeout(() => handleReset(), 3000);
        }
    };

    const handleRedeem = async () => {
        if (!scanResult?.parsedData || scanResult.parsedData.type !== 'redemption_punch_card_id') return;

        setCurrentState('processing');

        try {
            const result = await apiClient.redeemPunchCard(scanResult.parsedData.punch_card_id);
            showSuccessToast(`Reward Redeemed! ${result.shopName}`);
            
            setTimeout(() => handleReset(), 2000);
        } catch (error: any) {
            console.error('Redeem operation error:', error);
            showErrorToast(error.response?.data?.message || error.message || 'Redeem operation failed.');
            setTimeout(() => handleReset(), 3000);
        }
    };

    return (
        <EpunchPage title="QR Code Scanner">
            {currentState === 'scanning' && (
                <QRScanner onScanResult={handleScanResult} onError={handleError} />
            )}
            
            {currentState === 'userQR' && scanResult && (
                <CustomerScanResult
                    data={scanResult} 
                    onPunch={handlePunch} 
                    onReset={handleReset} 
                />
            )}
            
            {currentState === 'punchCardQR' && scanResult && (
                <ScanResultPunchCard 
                    data={scanResult} 
                    onRedeem={handleRedeem} 
                    onReset={handleReset} 
                />
            )}
            
            {currentState === 'processing' && (
                <div className={styles.processingContainer}>
                    <EpunchSpinner text="Processing..." />
                </div>
            )}
        </EpunchPage>
    );
};

export default ScannerPage; 