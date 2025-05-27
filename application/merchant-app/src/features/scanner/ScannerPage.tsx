import React, { useEffect, useState, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { apiClient } from 'e-punch-common-ui';
import { QRValueDto, LoyaltyProgramDto, PunchCardDto } from 'e-punch-common-core';
import { useAppSelector } from '../../store/hooks';
import styles from './ScannerPage.module.css';

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
                if (programs.length > 0) {
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

        return (
            <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                    color: '#f5f5dc', 
                    fontSize: '1em', 
                    marginBottom: '8px',
                    display: 'block'
                }}>
                    Select Loyalty Program:
                </label>
                <select
                    value={selectedLoyaltyProgramId}
                    onChange={(e) => setSelectedLoyaltyProgramId(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        fontSize: '1em',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        backgroundColor: '#fff'
                    }}
                >
                    {loyaltyPrograms.map((program) => (
                        <option key={program.id} value={program.id}>
                            {program.name} - {program.rewardDescription}
                        </option>
                    ))}
                </select>
            </div>
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
        <>
            <div className={styles.pageContainer}>
                <div className={styles.cameraViewWrapper}>
                    <video
                        ref={videoRef}
                        className={styles.videoFeed}
                        style={{ display: isCameraInitialized && !scanResult ? 'block' : 'none' }}
                        playsInline
                        muted
                    />
                    {scanResult && !isProcessingPunch && (
                        <>
                            <div style={{ 
                                color: '#f5f5dc', 
                                fontSize: '1.1em', 
                                marginBottom: '15px',
                                textAlign: 'center'
                            }}>
                                {getDisplayMessage()}
                            </div>
                            
                            {isLoadingPunchCard && (
                                <div style={{ color: '#f5f5dc', textAlign: 'center', marginBottom: '15px' }}>
                                    Loading punch card details...
                                </div>
                            )}
                            
                            {renderPunchCardDetails()}
                            {renderLoyaltyProgramSelector()}
                            
                            <div className={styles.buttonsContainer}>
                                <button
                                    onClick={handlePunchAndRestartScan}
                                    className={styles.punchButton}
                                    disabled={!scanResult || isProcessingPunch || isLoadingPunchCard || 
                                             (parsedQRData?.type === 'user_id' && !selectedLoyaltyProgramId)}
                                >
                                    {parsedQRData?.type === 'redemption_punch_card_id' ? 'REDEEM!' : 'PUNCH!'}
                                </button>
                                <button
                                    onClick={handleResetScan}
                                    className={styles.resetButton}
                                    disabled={!scanResult || isProcessingPunch}
                                >
                                    Reset
                                </button>
                            </div>
                        </>
                    )}

                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                    {punchMessage && <p className={styles.punchSuccessMessage}>{punchMessage}</p>}
                    {!scanResult && !isCameraInitialized && !errorMessage && (
                        <p className={styles.initializingMessage}>Initializing Camera...</p>
                    )}
                    {isLoadingLoyaltyPrograms && (
                        <p className={styles.initializingMessage}>Loading loyalty programs...</p>
                    )}
                </div>

                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
        </>
    );
};

export default ScannerPage; 