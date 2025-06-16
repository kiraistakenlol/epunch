import React, { useEffect, useState } from 'react';
import { apiClient } from 'e-punch-common-ui';
import { QRValueDto, PunchCardDto, LoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../../../store/hooks.ts';
import { ScanResultCard } from '../ScanResultCard.tsx';
import './ScanResultPunchCard.css';

interface PunchCardQRProps {
    data: {
        qrData: string;
        parsedData: QRValueDto;
    };
    onRedeem: () => void;
    onReset: () => void;
}

export const ScanResultPunchCard: React.FC<PunchCardQRProps> = ({ data, onRedeem, onReset }) => {
    const merchantId = useAppSelector(state => state.auth.merchant?.id);
    const [punchCardDetails, setPunchCardDetails] = useState<PunchCardDto | null>(null);
    const [loyaltyProgramDetails, setLoyaltyProgramDetails] = useState<LoyaltyProgramDto | null>(null);
    const [isLoadingPunchCard, setIsLoadingPunchCard] = useState(false);

    useEffect(() => {
        const fetchPunchCardDetails = async () => {
            if (data.parsedData.type === 'redemption_punch_card_id' && data.parsedData.punch_card_id) {
                setIsLoadingPunchCard(true);
                try {
                    const punchCard = await apiClient.getPunchCard(data.parsedData.punch_card_id);
                    setPunchCardDetails(punchCard);
                } catch (error: any) {
                    console.error('Failed to fetch punch card details:', error);
                } finally {
                    setIsLoadingPunchCard(false);
                }
            }
        };

        fetchPunchCardDetails();
    }, [data.parsedData]);

    useEffect(() => {
        const fetchLoyaltyProgramDetails = async () => {
            if (punchCardDetails && merchantId) {
                try {
                    const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
                    const loyaltyProgram = programs.find(lp => lp.id === punchCardDetails.loyaltyProgramId);
                    setLoyaltyProgramDetails(loyaltyProgram || null);
                } catch (error: any) {
                    console.error('Failed to fetch loyalty program details:', error);
                }
            }
        };

        fetchLoyaltyProgramDetails();
    }, [punchCardDetails, merchantId]);

    const getDisplayMessage = () => {
        if (data.parsedData.type === 'redemption_punch_card_id') {
            return `Reward Redemption: ${data.parsedData.punch_card_id.substring(0, 8)}...`;
        }
        return null;
    };

    return (
        <ScanResultCard
            title="🎁 Reward Redemption"
            subtitle={getDisplayMessage() || ''}
            onCancel={onReset}
            onConfirm={onRedeem}
            confirmText="REDEEM!"
            confirmDisabled={isLoadingPunchCard || !punchCardDetails}
        >
            {isLoadingPunchCard ? (
                <div className="punch-card-details">
                    <p className="loading-text">Loading punch card details...</p>
                </div>
            ) : punchCardDetails ? (
                <div className="punch-card-details">
                    <h3 className="details-title">Punch Card Details</h3>
                    <div className="details-content">
                        <p className="detail-item">
                            <strong>Shop:</strong> {punchCardDetails.shopName}
                        </p>
                        <p className="detail-item">
                            <strong>Address:</strong> {punchCardDetails.shopAddress}
                        </p>
                        <p className="detail-item">
                            <strong>Punches:</strong> {punchCardDetails.currentPunches}/{punchCardDetails.totalPunches}
                        </p>
                        <p className="detail-item">
                            <strong>Status:</strong> {punchCardDetails.status}
                        </p>
                    </div>
                </div>
            ) : null}

            {punchCardDetails && loyaltyProgramDetails && (
                <div className="loyalty-program-details">
                    <h3 className="details-title">Loyalty Program</h3>
                    <div className="details-content">
                        <p className="detail-item">
                            <strong>Name:</strong> {loyaltyProgramDetails.name}
                        </p>
                        <p className="detail-item">
                            <strong>Reward:</strong> {loyaltyProgramDetails.rewardDescription}
                        </p>
                        {loyaltyProgramDetails.description && (
                            <p className="detail-item program-description">
                                {loyaltyProgramDetails.description}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </ScanResultCard>
    );
}; 