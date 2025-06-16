import React, { useEffect, useState } from 'react';
import { apiClient } from 'e-punch-common-ui';
import { QRValueDto, LoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../store/hooks';
import { 
    EpunchBox, 
    EpunchCard, 
    EpunchTypography, 
    EpunchButton,
    EpunchSmartGrid 
} from '../../../components/foundational';

interface UserPersonalQRProps {
    data: {
        qrData: string;
        parsedData: QRValueDto;
    };
    onPunch: (loyaltyProgramId: string) => void;
    onReset: () => void;
}

export const UserPersonalQR: React.FC<UserPersonalQRProps> = ({ data, onPunch, onReset }) => {
    const merchantId = useAppSelector(state => state.auth.merchant?.id);
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
            <EpunchBox textAlign="center">
                <EpunchTypography color="light">Loading loyalty programs...</EpunchTypography>
            </EpunchBox>
        );
    }

    return (
        <EpunchBox width="100%" maxWidth={500} mx="auto">
            <EpunchCard>
                <EpunchTypography color="primary" fontWeight={600}>
                    👤 Customer QR Code
                </EpunchTypography>
                <EpunchTypography color="secondary">
                    {getDisplayMessage()}
                </EpunchTypography>
            </EpunchCard>

            {loyaltyPrograms.length > 0 && (
                <EpunchCard>
                    <EpunchTypography color="primary" fontWeight={600} mb={2}>
                        Select Loyalty Program
                    </EpunchTypography>
                    
                    {loyaltyPrograms.length === 1 ? (
                        <EpunchBox
                            border="2px solid #5d4037"
                            borderRadius="8px"
                            p={2}
                        >
                            <EpunchTypography color="primary" fontWeight={600}>
                                {loyaltyPrograms[0].name}
                            </EpunchTypography>
                            <EpunchTypography color="secondary" mt={0.5}>
                                {loyaltyPrograms[0].requiredPunches} punches → {loyaltyPrograms[0].rewardDescription}
                            </EpunchTypography>
                        </EpunchBox>
                    ) : (
                        <EpunchBox>
                            <EpunchTypography color="secondary" mb={2}>
                                Choose which loyalty program to add a punch to:
                            </EpunchTypography>
                            <EpunchSmartGrid>
                                {loyaltyPrograms.map((program) => (
                                    <EpunchBox
                                        key={program.id}
                                        onClick={() => setSelectedLoyaltyProgramId(program.id)}
                                        color={selectedLoyaltyProgramId === program.id ? '#f5f5dc' : '#3e2723'}
                                        border={`2px solid ${selectedLoyaltyProgramId === program.id ? '#5d4037' : '#e0e0e0'}`}
                                        borderRadius="8px"
                                        p={2}
                                    >
                                        <EpunchTypography fontWeight={600} mb={0.5}>
                                            {program.name}
                                        </EpunchTypography>
                                        <EpunchTypography 
                                        >
                                            {program.requiredPunches} punches → {program.rewardDescription}
                                        </EpunchTypography>
                                    </EpunchBox>
                                ))}
                            </EpunchSmartGrid>
                        </EpunchBox>
                    )}
                </EpunchCard>
            )}

            <EpunchBox display="flex" gap={2} justifyContent="center">
                <EpunchButton variant="outlined" onClick={onReset}>
                    Reset
                </EpunchButton>
                <EpunchButton 
                    onClick={handlePunch}
                    disabled={!selectedLoyaltyProgramId}
                >
                    PUNCH!
                </EpunchButton>
            </EpunchBox>
        </EpunchBox>
    );
}; 