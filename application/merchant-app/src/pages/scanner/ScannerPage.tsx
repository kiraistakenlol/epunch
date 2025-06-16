import React, { useState } from 'react';
import { apiClient } from 'e-punch-common-ui';
import { QRValueDto } from 'e-punch-common-core';
import { EpunchPage } from '../../components/foundational';
import { Scanner } from './components/Scanner';
import { UserPersonalQR } from './components/UserPersonalQR';
import { PunchCardQR } from './components/PunchCardQR';
import { ProcessingState } from './components/ProcessingState';
import { MessageDisplay } from './components/MessageDisplay';

type ScannerState = 'scanning' | 'userQR' | 'punchCardQR' | 'processing';

interface QRScanResult {
    qrData: string;
    parsedData: QRValueDto;
}

const ScannerPage: React.FC = () => {
    const [currentState, setCurrentState] = useState<ScannerState>('scanning');
    const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const handleScanResult = (result: QRScanResult) => {
        setScanResult(result);
        setErrorMessage(null);
        setSuccessMessage(null);
        
        if (result.parsedData.type === 'user_id') {
            setCurrentState('userQR');
        } else if (result.parsedData.type === 'redemption_punch_card_id') {
            setCurrentState('punchCardQR');
        }
    };

    const handleError = (error: string) => {
        setErrorMessage(error);
    };

    const handleReset = () => {
        setCurrentState('scanning');
        setScanResult(null);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handlePunch = async (loyaltyProgramId: string) => {
        if (!scanResult?.parsedData || scanResult.parsedData.type !== 'user_id') return;

        setCurrentState('processing');
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const result = await apiClient.recordPunch(scanResult.parsedData.user_id, loyaltyProgramId);
            setSuccessMessage(result.rewardAchieved ? "Reward Achieved!" : "Great.");
            
            setTimeout(() => handleReset(), 2000);
        } catch (error: any) {
            console.error('Punch operation error:', error);
            setErrorMessage(error.response?.data?.message || error.message || 'Punch operation failed.');
            setTimeout(() => handleReset(), 3000);
        }
    };

    const handleRedeem = async () => {
        if (!scanResult?.parsedData || scanResult.parsedData.type !== 'redemption_punch_card_id') return;

        setCurrentState('processing');
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const result = await apiClient.redeemPunchCard(scanResult.parsedData.punch_card_id);
            setSuccessMessage(`Reward Redeemed! ${result.shopName}`);
            
            setTimeout(() => handleReset(), 2000);
        } catch (error: any) {
            console.error('Redeem operation error:', error);
            setErrorMessage(error.response?.data?.message || error.message || 'Redeem operation failed.');
            setTimeout(() => handleReset(), 3000);
        }
    };

    return (
        <EpunchPage title="QR Code Scanner">
            {currentState === 'scanning' && (
                <Scanner onScanResult={handleScanResult} onError={handleError} />
            )}
            
            {currentState === 'userQR' && scanResult && (
                <UserPersonalQR 
                    data={scanResult} 
                    onPunch={handlePunch} 
                    onReset={handleReset} 
                />
            )}
            
            {currentState === 'punchCardQR' && scanResult && (
                <PunchCardQR 
                    data={scanResult} 
                    onRedeem={handleRedeem} 
                    onReset={handleReset} 
                />
            )}
            
            {currentState === 'processing' && <ProcessingState />}
            
            {errorMessage && <MessageDisplay message={errorMessage} type="error" />}
            {successMessage && <MessageDisplay message={successMessage} type="success" />}
        </EpunchPage>
    );
};

export default ScannerPage; 