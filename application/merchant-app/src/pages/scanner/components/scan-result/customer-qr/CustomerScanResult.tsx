import React, { useEffect, useState } from 'react';
import { apiClient } from 'e-punch-common-ui';
import { QRValueDto, LoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../../../store/hooks.ts';
import { ScanResultCard } from '../ScanResultCard.tsx';
import './CustomerScanResult.css';

interface UserPersonalQRProps {
    data: {
        qrData: string;
        parsedData: QRValueDto;
    };
    onPunch: (loyaltyProgramId: string) => void;
    onReset: () => void;
}

export const CustomerScanResult: React.FC<UserPersonalQRProps> = ({ data, onPunch, onReset }) => {
    const merchantId = useAppSelector(state => state.merchant.merchant?.id);
    const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
    const [selectedLoyaltyProgramId, setSelectedLoyaltyProgramId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchLoyaltyPrograms = async () => {
            if (!merchantId) return;

            setIsLoading(true);
            try {
                const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
                setLoyaltyPrograms(programs);
                if (programs.length === 1) {
                    setSelectedLoyaltyProgramId(programs[0].id);
                }
            } catch (error: any) {
                console.error('Failed to fetch loyalty programs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLoyaltyPrograms();
    }, [merchantId]);

    const handlePunch = () => {
        if (selectedLoyaltyProgramId) {
            onPunch(selectedLoyaltyProgramId);
        }
    };

    const getDisplayMessage = () => {
        if (data.parsedData.type === 'user_id') {
            return `User ID: ${data.parsedData.user_id.substring(0, 8)}...`;
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="loading-state ">
                <div className="loading-spinner"></div>
                <p>Loading loyalty programs...</p>
            </div>
        );
    }

    return (
        <ScanResultCard
            title="👤 Customer QR Code"
            subtitle={getDisplayMessage() || ''}
            onCancel={onReset}
            onConfirm={handlePunch}
            confirmText="PUNCH!"
            confirmDisabled={!selectedLoyaltyProgramId}
        >
            {/* Loyalty Programs Section */}
            {loyaltyPrograms.length > 0 && (
                <div className="loyalty-card">
                    <h3 className="loyalty-title">Select Loyalty Program</h3>

                    {loyaltyPrograms.length === 1 ? (
                        <div className="single-program">
                            <h4 className="program-name">{loyaltyPrograms[0].name}</h4>
                            <p className="program-details">
                                {loyaltyPrograms[0].requiredPunches} punches → {loyaltyPrograms[0].rewardDescription}
                            </p>
                        </div>
                    ) : (
                        <div className="multiple-programs">
                            <p className="instruction">Choose which loyalty program to add a punch to:</p>
                            <div className="programs-grid">
                                {loyaltyPrograms.map((program) => (
                                    <div
                                        key={program.id}
                                        className={`program-option ${selectedLoyaltyProgramId === program.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedLoyaltyProgramId(program.id)}
                                    >
                                        <h4 className="program-name">{program.name}</h4>
                                        <p className="program-details">
                                            {program.requiredPunches} punches → {program.rewardDescription}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </ScanResultCard>
    );
}; 