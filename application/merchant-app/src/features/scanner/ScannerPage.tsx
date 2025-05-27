import React, { useEffect, useState, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { apiClient } from 'e-punch-common-ui';
import { QRValueDto, LoyaltyProgramDto, PunchCardDto } from 'e-punch-common-core';
import { useAppSelector } from '../../store/hooks';
import { 
    Box, 
    Typography,
    SelectChangeEvent,
    Button
} from '@mui/material';

/**
 * @file ScannerPage.tsx
 * Implements a QR code scanner page for the merchant application.
 *
 * Camera/Scanning Logic Overview:
 * 1. `useEffect` calls `startVideoStream` when `scanResult` is null.
 * 2. `startVideoStream` acquires camera feed and starts the `scanFrame` loop.
 * 3. `scanFrame` (useCallback dependent on `scanResult`):
 *    - Continuously captures frames from the video via `requestAnimationFrame`.
 *    - Draws frame to a hidden canvas and uses `jsQR` to detect QR codes.
 *    - If QR found: sets `scanResult` with QR data, then calls `stopVideoStream`.
 *    - The loop self-terminates if `scanResult` becomes non-null or stream becomes inactive.
 * 4. `scanResult` (useState):
 *    - Stores the decoded QR code data (string) or null.
 *    - Drives UI changes (shows success message, enables punch/reset buttons, hides video).
 *    - When set to null (on reset/punch), triggers `useEffect` to restart `startVideoStream`.
 * 5. `stopVideoStream`: Halts camera tracks and cancels `requestAnimationFrame` for `scanFrame`.
 */

const ScannerPage: React.FC = () => {
    const merchantId = useAppSelector(state => state.auth.merchant?.id);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [punchMessage, setPunchMessage] = useState<string | null>(null);
    const [parsedQRData, setParsedQRData] = useState<QRValueDto | null>(null);
    const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
    const [selectedLoyaltyProgramId, setSelectedLoyaltyProgramId] = useState<string>('');
    const [punchCardDetails, setPunchCardDetails] = useState<PunchCardDto | null>(null);
    const [isLoadingLoyaltyPrograms, setIsLoadingLoyaltyPrograms] = useState(false);
    const [isLoadingPunchCard, setIsLoadingPunchCard] = useState(false);
    const [loyaltyProgramDetails, setLoyaltyProgramDetails] = useState<LoyaltyProgramDto | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    const streamRef = useRef<MediaStream | null>(null);

    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    const [isProcessingPunch, setIsProcessingPunch] = useState(false);

    useEffect(() => {
        const fetchLoyaltyPrograms = async () => {
            if (!merchantId) {
                setErrorMessage('Merchant not authenticated');
                return;
            }

            setIsLoadingLoyaltyPrograms(true);
            try {
                const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
                setLoyaltyPrograms(programs);
                if (programs.length === 1) {
                    setSelectedLoyaltyProgramId(programs[0].id);
                }
            } catch (error: any) {
                console.error('Failed to fetch loyalty programs:', error);
                setErrorMessage(`Failed to load loyalty programs: ${error.message}`);
            } finally {
                setIsLoadingLoyaltyPrograms(false);
            }
        };

        fetchLoyaltyPrograms();
    }, [merchantId]);

    useEffect(() => {
        const fetchPunchCardDetails = async () => {
            if (parsedQRData?.type === 'redemption_punch_card_id' && parsedQRData.punch_card_id) {
                setIsLoadingPunchCard(true);
                try {
                    const punchCard = await apiClient.getPunchCard(parsedQRData.punch_card_id);
                    setPunchCardDetails(punchCard);
                } catch (error: any) {
                    console.error('Failed to fetch punch card details:', error);
                    setErrorMessage(`Failed to load punch card details: ${error.message}`);
                } finally {
                    setIsLoadingPunchCard(false);
                }
            }
        };

        fetchPunchCardDetails();
    }, [parsedQRData]);

    useEffect(() => {
        const fetchLoyaltyProgramDetails = async () => {
            if (punchCardDetails && loyaltyPrograms.length > 0) {
                const loyaltyProgram = loyaltyPrograms.find(lp => lp.id === punchCardDetails.loyaltyProgramId);
                setLoyaltyProgramDetails(loyaltyProgram || null);
            }
        };

        fetchLoyaltyProgramDetails();
    }, [punchCardDetails, loyaltyPrograms]);

    const parseQRData = (qrString: string): QRValueDto | null => {
        try {
            const parsed = JSON.parse(qrString) as QRValueDto;
            if (parsed.type === 'user_id' && parsed.user_id) {
                return parsed;
            }
            if (parsed.type === 'redemption_punch_card_id' && parsed.punch_card_id) {
                return parsed;
            }
            return null;
        } catch (error) {
            console.error('Failed to parse QR data as JSON:', error);
            return null;
        }
    };

    const scanFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
            if (streamRef.current?.active && !scanResult) {
                requestRef.current = requestAnimationFrame(scanFrame);
            }
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });

        if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            try {
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code && code.data) {
                    console.log("QR Code detected:", code.data);
                    const parsed = parseQRData(code.data);
                    if (parsed) {
                        setScanResult(code.data);
                        setParsedQRData(parsed);
                        stopVideoStream();
                        return;
                    } else {
                        console.warn("Invalid QR format detected, continuing scan...");
                    }
                }
            } catch (error) {
                // console.error("jsQR error:", error);
            }
        }
        if (streamRef.current?.active && !scanResult) {
            requestRef.current = requestAnimationFrame(scanFrame);
        }
    }, [scanResult]);

    const stopVideoStream = useCallback(() => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = undefined;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            console.log("Video stream stopped.");
        }
    }, []);

    const startVideoStream = useCallback(async () => {
        if (streamRef.current || scanResult || isProcessingPunch) {
            console.log("Video stream start prevented. Current state:", {
                hasStream: !!streamRef.current,
                scanResult,
                isProcessingPunch
            });
            return;
        }

        setErrorMessage(null);
        setPunchMessage(null);
        console.log("Attempting to start video stream...");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play().catch(e => console.error("Video play error:", e));
                setIsCameraInitialized(true);
                console.log("Video stream started. Starting scan loop.");
                if (!scanResult) {
                    requestRef.current = requestAnimationFrame(scanFrame);
                }
            } else {
                throw new Error("Video element not available.");
            }
        } catch (err: any) {
            console.error("Error starting video stream:", err);
            setErrorMessage(`Camera error: ${err.name || err.message || err}`);
            setIsCameraInitialized(false);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
    }, [scanFrame, scanResult, isProcessingPunch]);

    useEffect(() => {
        if (!scanResult) {
            startVideoStream();
        }
        return () => {
            console.log("ScannerPage unmounting, stopping video stream.");
            stopVideoStream();
        };
    }, [scanResult, startVideoStream, stopVideoStream]);

    const handleResetScan = () => {
        setScanResult(null);
        setParsedQRData(null);
        setPunchMessage(null);
        setErrorMessage(null);
        setPunchCardDetails(null);
        setLoyaltyProgramDetails(null);
    };

    const handlePunchAndRestartScan = async () => {
        if (!scanResult || !parsedQRData) return;

        setIsProcessingPunch(true);
        setPunchMessage(null);
        setErrorMessage(null);

        try {
            if (parsedQRData.type === 'redemption_punch_card_id') {
                console.log(`Attempting to redeem punch card: ${parsedQRData.punch_card_id}`);
                const result = await apiClient.redeemPunchCard(parsedQRData.punch_card_id);
                setPunchMessage(`Reward Redeemed! ${result.shopName}`);
            } else if (parsedQRData.type === 'user_id') {
                if (!selectedLoyaltyProgramId) {
                    setErrorMessage("Please select a loyalty program.");
                    setIsProcessingPunch(false);
                    return;
                }

                console.log(`Attempting to punch for user: ${parsedQRData.user_id} on program: ${selectedLoyaltyProgramId}`);
                const result = await apiClient.recordPunch(parsedQRData.user_id, selectedLoyaltyProgramId);
                setPunchMessage(result.rewardAchieved ? "Reward Achieved!" : "Great.");
            } else {
                setErrorMessage("Invalid QR code type.");
                return;
            }
        } catch (error: any) {
            console.error('Operation error:', error);
            setErrorMessage(error.response?.data?.message || error.message || 'Operation failed.');
            setPunchMessage(null);
        } finally {
            setTimeout(() => {
                setScanResult(null);
                setParsedQRData(null);
                setIsProcessingPunch(false);
                setPunchCardDetails(null);
                setLoyaltyProgramDetails(null);
            }, 2000);
        }
    };

    const getDisplayMessage = () => {
        if (!parsedQRData) return null;
        
        if (parsedQRData.type === 'user_id') {
            return `User ID: ${parsedQRData.user_id.substring(0, 8)}...`;
        } else if (parsedQRData.type === 'redemption_punch_card_id') {
            return `Reward Redemption: ${parsedQRData.punch_card_id.substring(0, 8)}...`;
        }
        return null;
    };

    const renderLoyaltyProgramSelector = () => {
        if (parsedQRData?.type !== 'user_id' || loyaltyPrograms.length === 0) return null;

        const handleSelectChange = (event: SelectChangeEvent) => {
            setSelectedLoyaltyProgramId(event.target.value);
        };

        const selectedProgram = loyaltyPrograms.find(p => p.id === selectedLoyaltyProgramId);

        return (
            <Box sx={{ 
                backgroundColor: '#f5f5dc', 
                borderRadius: '12px', 
                padding: 3, 
                marginBottom: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <Typography variant="h6" sx={{ color: '#3e2723', fontWeight: 600, mb: 2 }}>
                    Select Loyalty Program
                </Typography>
                
                {loyaltyPrograms.length === 1 ? (
                    // Single program - show directly
                    <Box sx={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #5d4037', 
                        borderRadius: '8px', 
                        padding: 2 
                    }}>
                        <Typography variant="h6" sx={{ color: '#3e2723', fontWeight: 600 }}>
                            {loyaltyPrograms[0].name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#795548', mt: 0.5 }}>
                            {loyaltyPrograms[0].requiredPunches} punches → {loyaltyPrograms[0].rewardDescription}
                        </Typography>
                    </Box>
                ) : (
                    // Multiple programs - show grid selection
                    <Box>
                        <Typography variant="body2" sx={{ color: '#5d4037', mb: 2 }}>
                            Choose which loyalty program to add a punch to:
                        </Typography>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                            gap: 2 
                        }}>
                            {loyaltyPrograms.map((program) => (
                                <Box
                                    key={program.id}
                                    onClick={() => setSelectedLoyaltyProgramId(program.id)}
                                    sx={{
                                        backgroundColor: selectedLoyaltyProgramId === program.id ? '#5d4037' : '#fff',
                                        color: selectedLoyaltyProgramId === program.id ? '#f5f5dc' : '#3e2723',
                                        border: `2px solid ${selectedLoyaltyProgramId === program.id ? '#5d4037' : '#e0e0e0'}`,
                                        borderRadius: '8px',
                                        padding: 2,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: '#5d4037',
                                            backgroundColor: selectedLoyaltyProgramId === program.id ? '#6d4c41' : '#f5f5f5',
                                        }
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        {program.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        opacity: selectedLoyaltyProgramId === program.id ? 0.9 : 0.7 
                                    }}>
                                        {program.requiredPunches} punches → {program.rewardDescription}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        );
    };

    const renderPunchCardDetails = () => {
        if (parsedQRData?.type !== 'redemption_punch_card_id' || !punchCardDetails) return null;

        return (
            <div style={{ 
                color: '#f5f5dc', 
                fontSize: '0.9em', 
                marginBottom: '15px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '10px',
                borderRadius: '8px'
            }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#fff' }}>Redemption Details:</h4>
                <p style={{ margin: '4px 0' }}><strong>Shop:</strong> {punchCardDetails.shopName}</p>
                <p style={{ margin: '4px 0' }}><strong>Address:</strong> {punchCardDetails.shopAddress}</p>
                <p style={{ margin: '4px 0' }}><strong>Punches:</strong> {punchCardDetails.currentPunches}/{punchCardDetails.totalPunches}</p>
                <p style={{ margin: '4px 0' }}><strong>Status:</strong> {punchCardDetails.status}</p>
                <p style={{ margin: '4px 0' }}><strong>Card ID:</strong> {punchCardDetails.id.substring(0, 8)}...</p>
            </div>
        );
    };

    return (
        <Box sx={{ 
            minHeight: 'calc(100vh - 140px)', 
            backgroundColor: '#424242', 
            padding: 2,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ 
                    color: '#f5f5dc', 
                    fontWeight: 'bold',
                    textShadow: '1px 1px 1px #3e2723',
                    mb: 1
                }}>
                    QR Code Scanner
                </Typography>
                <Typography variant="body1" sx={{ color: '#f5f5dc', opacity: 0.8 }}>
                    {!scanResult ? 'Point camera at customer QR code' : 'QR Code Detected!'}
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Camera/Scanner Section */}
                <Box sx={{ 
                    width: '100%', 
                    maxWidth: 400, 
                    backgroundColor: '#333', 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    marginBottom: scanResult ? 3 : 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}>
                    <video
                        ref={videoRef}
                        style={{ 
                            width: '100%', 
                            height: 'auto',
                            display: isCameraInitialized && !scanResult ? 'block' : 'none' 
                        }}
                        playsInline
                        muted
                    />
                    
                    {!scanResult && !isCameraInitialized && !errorMessage && (
                        <Box sx={{ 
                            height: 300, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: '#f5f5dc'
                        }}>
                            <Typography>Initializing Camera...</Typography>
                        </Box>
                    )}
                </Box>

                {/* QR Code Result Section */}
                {scanResult && !isProcessingPunch && (
                    <Box sx={{ width: '100%', maxWidth: 500 }}>
                        {/* QR Code Info */}
                        <Box sx={{ 
                            backgroundColor: '#f5f5dc', 
                            borderRadius: '12px', 
                            padding: 2, 
                            marginBottom: 2,
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}>
                            <Typography variant="h6" sx={{ color: '#3e2723', fontWeight: 600, mb: 1 }}>
                                {parsedQRData?.type === 'user_id' ? '👤 Customer QR Code' : '🎁 Reward Redemption'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#795548' }}>
                                {getDisplayMessage()}
                            </Typography>
                        </Box>

                        {/* Loyalty Program Selection */}
                        {renderLoyaltyProgramSelector()}

                        {/* Punch Card Details for Redemption */}
                        {parsedQRData?.type === 'redemption_punch_card_id' && (
                            <>
                                <Box sx={{ 
                                    backgroundColor: '#f5f5dc', 
                                    borderRadius: '12px', 
                                    padding: 2, 
                                    marginBottom: 2,
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <Typography variant="h6" sx={{ color: '#3e2723', fontWeight: 600, mb: 1 }}>
                                        Punch Card Details
                                    </Typography>
                                    {isLoadingPunchCard ? (
                                        <Typography sx={{ color: '#795548' }}>Loading punch card details...</Typography>
                                    ) : punchCardDetails ? (
                                        <Box>
                                            <Typography variant="body2" sx={{ color: '#5d4037', mb: 0.5 }}>
                                                <strong>Shop:</strong> {punchCardDetails.shopName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#5d4037', mb: 0.5 }}>
                                                <strong>Address:</strong> {punchCardDetails.shopAddress}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#5d4037', mb: 0.5 }}>
                                                <strong>Punches:</strong> {punchCardDetails.currentPunches}/{punchCardDetails.totalPunches}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#5d4037' }}>
                                                <strong>Status:</strong> {punchCardDetails.status}
                                            </Typography>
                                        </Box>
                                    ) : null}
                                </Box>

                                {/* Loyalty Program Details for Redemption */}
                                {punchCardDetails && loyaltyProgramDetails && (
                                    <Box sx={{ 
                                        backgroundColor: '#f5f5dc', 
                                        borderRadius: '12px', 
                                        padding: 2, 
                                        marginBottom: 2,
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <Typography variant="h6" sx={{ color: '#3e2723', fontWeight: 600, mb: 1 }}>
                                            Loyalty Program
                                        </Typography>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: '#5d4037', mb: 0.5 }}>
                                                <strong>Name:</strong> {loyaltyProgramDetails.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#5d4037', mb: 0.5 }}>
                                                <strong>Reward:</strong> {loyaltyProgramDetails.rewardDescription}
                                            </Typography>
                                            {loyaltyProgramDetails.description && (
                                                <Typography variant="body2" sx={{ color: '#795548', fontStyle: 'italic', mt: 1 }}>
                                                    {loyaltyProgramDetails.description}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                )}
                            </>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                onClick={handleResetScan}
                                disabled={isProcessingPunch}
                                sx={{
                                    borderColor: '#f5f5dc',
                                    color: '#f5f5dc',
                                    '&:hover': {
                                        backgroundColor: 'rgba(245, 245, 220, 0.1)',
                                        borderColor: '#f5f5dc',
                                    },
                                    minWidth: 120
                                }}
                            >
                                Reset
                            </Button>
                            
                            <Button
                                variant="contained"
                                onClick={handlePunchAndRestartScan}
                                disabled={!scanResult || isProcessingPunch || isLoadingPunchCard || 
                                         (parsedQRData?.type === 'user_id' && !selectedLoyaltyProgramId)}
                                sx={{
                                    backgroundColor: '#5d4037',
                                    color: '#f5f5dc',
                                    '&:hover': {
                                        backgroundColor: '#6d4c41',
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#757575',
                                    },
                                    minWidth: 120,
                                    fontWeight: 'bold'
                                }}
                            >
                                {parsedQRData?.type === 'redemption_punch_card_id' ? 'REDEEM!' : 'PUNCH!'}
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Loading States */}
                {isLoadingLoyaltyPrograms && (
                    <Typography sx={{ color: '#f5f5dc', textAlign: 'center' }}>
                        Loading loyalty programs...
                    </Typography>
                )}
            </Box>

            {/* Messages */}
            {errorMessage && (
                <Box sx={{ 
                    backgroundColor: 'rgba(211, 47, 47, 0.9)', 
                    color: '#fff', 
                    padding: 2, 
                    borderRadius: '8px', 
                    marginTop: 2,
                    textAlign: 'center'
                }}>
                    {errorMessage}
                </Box>
            )}
            
            {punchMessage && (
                <Box sx={{ 
                    backgroundColor: 'rgba(76, 175, 80, 0.9)', 
                    color: '#fff', 
                    padding: 2, 
                    borderRadius: '8px', 
                    marginTop: 2,
                    textAlign: 'center'
                }}>
                    {punchMessage}
                </Box>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default ScannerPage; 