import React, { useEffect, useState } from 'react';
import { apiClient } from 'e-punch-common-ui';
import { QRValueDto, PunchCardDto, LoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../store/hooks';
import {
    EpunchBox,
    EpunchCard,
    EpunchTypography,
    EpunchButton
} from '../../../components/foundational';

interface PunchCardQRProps {
    data: {
        qrData: string;
        parsedData: QRValueDto;
    };
    onRedeem: () => void;
    onReset: () => void;
}

export const PunchCardQR: React.FC<PunchCardQRProps> = ({ data, onRedeem, onReset }) => {
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
        <EpunchBox width="100%" maxWidth={500} mx="auto">
            <EpunchCard>
                <EpunchTypography color="primary" fontWeight={600}>
                    🎁 Reward Redemption
                </EpunchTypography>
                <EpunchTypography color="secondary">
                    {getDisplayMessage()}
                </EpunchTypography>
            </EpunchCard>

            {isLoadingPunchCard ? (
                <EpunchCard>
                    <EpunchTypography color="secondary">Loading punch card details...</EpunchTypography>
                </EpunchCard>
            ) : punchCardDetails ? (
                <EpunchCard>
                    <EpunchTypography color="primary" fontWeight={600} mb={1}>
                        Punch Card Details
                    </EpunchTypography>
                    <EpunchBox>
                        <EpunchTypography color="secondary" mb={0.5}>
                            <strong>Shop:</strong> {punchCardDetails.shopName}
                        </EpunchTypography>
                        <EpunchTypography color="secondary" mb={0.5}>
                            <strong>Address:</strong> {punchCardDetails.shopAddress}
                        </EpunchTypography>
                        <EpunchTypography color="secondary" mb={0.5}>
                            <strong>Punches:</strong> {punchCardDetails.currentPunches}/{punchCardDetails.totalPunches}
                        </EpunchTypography>
                        <EpunchTypography color="secondary">
                            <strong>Status:</strong> {punchCardDetails.status}
                        </EpunchTypography>
                    </EpunchBox>
                </EpunchCard>
            ) : null}

            {punchCardDetails && loyaltyProgramDetails && (
                <EpunchCard >
                    <EpunchTypography color="primary" fontWeight={600} mb={1}>
                        Loyalty Program
                    </EpunchTypography>
                    <EpunchBox>
                        <EpunchTypography color="secondary" mb={0.5}>
                            <strong>Name:</strong> {loyaltyProgramDetails.name}
                        </EpunchTypography>
                        <EpunchTypography color="secondary" mb={0.5}>
                            <strong>Reward:</strong> {loyaltyProgramDetails.rewardDescription}
                        </EpunchTypography>
                        {loyaltyProgramDetails.description && (
                            <EpunchTypography color="secondary" fontStyle="italic" mt={1}>
                                {loyaltyProgramDetails.description}
                            </EpunchTypography>
                        )}
                    </EpunchBox>
                </EpunchCard>
            )}

            <EpunchBox display="flex" gap={2} justifyContent="center">
                <EpunchButton variant="outlined" onClick={onReset}>
                    Reset
                </EpunchButton>
                <EpunchButton
                    onClick={onRedeem}
                    disabled={isLoadingPunchCard || !punchCardDetails}
                >
                    REDEEM!
                </EpunchButton>
            </EpunchBox>
        </EpunchBox>
    );
}; 