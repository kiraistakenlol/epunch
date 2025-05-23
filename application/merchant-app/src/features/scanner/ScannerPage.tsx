import React, { useEffect, useState, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { apiClient, AppHeader } from 'e-punch-common-ui';
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
    const [scanResult, setScanResult] = useState<string | null>(null); // Stores decoded QR data
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [punchMessage, setPunchMessage] = useState<string | null>(null);
    const [testPunchMessage, setTestPunchMessage] = useState<string | null>(null); // For test button

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(); // For requestAnimationFrame
    const streamRef = useRef<MediaStream | null>(null);

    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    const [isProcessingPunch, setIsProcessingPunch] = useState(false);
    // Function to draw video frame to canvas and try to decode QR
    const scanFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
            if (streamRef.current?.active && !scanResult) { // Only request new frame if actively scanning
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
                    inversionAttempts: "dontInvert", // Or "attemptBoth" if needed
                });

                if (code && code.data) {
                    console.log("QR Code detected:", code.data);
                    setScanResult(code.data);
                    stopVideoStream(); // Stop scanning once a code is found
                    return; // Exit scan loop
                }
            } catch (error) {
                // console.error("jsQR error:", error); // Can be noisy
            }
        }
        if (streamRef.current?.active && !scanResult) { // Check scanResult here too
            requestRef.current = requestAnimationFrame(scanFrame);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scanResult]); // Added scanResult to dependencies to stop loop if result is found

    // Function to stop the video stream and scanning loop
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
        // setIsCameraInitialized(false); // Keep true if camera was once initialized, for consistent UI
        // We control video display via scanResult state now
    }, []);

    // Function to start the video stream and scanning loop
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
                // Ensure video plays. Might need videoRef.current.play() for some browsers if autoplay doesn't work.
                await videoRef.current.play().catch(e => console.error("Video play error:", e));
                setIsCameraInitialized(true);
                console.log("Video stream started. Starting scan loop.");
                if (!scanResult) { // Start scan loop only if no result yet
                    requestRef.current = requestAnimationFrame(scanFrame);
                }
            } else {
                throw new Error("Video element not available.");
            }
        } catch (err: any) {
            console.error("Error starting video stream:", err);
            setErrorMessage(`Camera error: ${err.name || err.message || err}`);
            setIsCameraInitialized(false);
            if (streamRef.current) { // Cleanup if stream was partially acquired
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
    }, [scanFrame, scanResult, isProcessingPunch]);

    useEffect(() => {
        if (!scanResult) { // Only start video if no scan result exists
            startVideoStream();
        }
        return () => {
            console.log("ScannerPage unmounting, stopping video stream.");
            stopVideoStream();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scanResult, startVideoStream, stopVideoStream]);

    const handleResetScan = () => {
        setScanResult(null);
        setPunchMessage(null);
        setErrorMessage(null);
        // startVideoStream will be called by the useEffect dependency on scanResult changing to null
    };

    const handlePunchAndRestartScan = async () => {
        if (!scanResult) return;

        // TODO: Replace this with a proper way to get loyaltyProgramId
        const loyaltyProgramId = "ca8a6765-e272-4aaa-b7a9-c25863ff1678"; // Placeholder

        if (!loyaltyProgramId) {
            setErrorMessage("Loyalty Program ID is not configured. Cannot punch.");
            setIsProcessingPunch(false); // Make sure to reset this if we bail early
            return;
        }

        setIsProcessingPunch(true);
        setPunchMessage(null);
        setErrorMessage(null);

        try {
            console.log(`Attempting to punch for user: ${scanResult} on program: ${loyaltyProgramId}`);
            const result = await apiClient.recordPunch(scanResult, loyaltyProgramId); // Use apiClient
            setPunchMessage(result.rewardAchieved ? "Reward Achieved!" : "Great."); // Use message from PunchOperationResultDto
            // You can use other fields from result too, e.g., result.rewardAchieved
        } catch (error: any) {
            console.error('Punch error:', error);
            setErrorMessage(error.response?.data?.message || error.message || 'Failed to record punch.');
            setPunchMessage(null);
        } finally {
            // Delay the transition back to scanning state
            setTimeout(() => {
                setScanResult(null); // This will trigger useEffect to restart scanning
                setIsProcessingPunch(false);
                // Clear messages once we are truly ready to scan again, or they might persist too long
                // setPunchMessage(null); // User might want to see this until next scan actually starts
                // setErrorMessage(null);
            }, 2000);
        }
    };

    const handleTestPunch = async () => {
        const testUserId = '412dbe6d-e933-464e-87e2-31fe9c9ee6ac';
        // TODO: Ensure this loyaltyProgramId is valid for testing against your backend data
        const loyaltyProgramId = "ca8a6765-e272-4aaa-b7a9-c25863ff1678"; // Placeholder

        if (!loyaltyProgramId) {
            setTestPunchMessage("Test Punch Error: Placeholder Loyalty Program ID is not configured.");
            return;
        }

        setTestPunchMessage("Processing test punch...");
        setErrorMessage(null); // Clear main error message
        setPunchMessage(null); // Clear main punch message

        try {
            console.log(`Attempting TEST punch for user: ${testUserId} on program: ${loyaltyProgramId}`);
            const result = await apiClient.recordPunch(testUserId, loyaltyProgramId);
            setTestPunchMessage(`Test Punch Success: ${result.rewardAchieved}`);
        } catch (error: any) {
            console.error('Test Punch error:', error);
            setTestPunchMessage(`Test Punch Error: ${error.response?.data?.message || error.message || 'Failed to record test punch.'}`);
        }
    };

    return (
        <>
            <AppHeader title="EPunch Merchant" />
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
                    <div className={styles.buttonsContainer}>
                        <button
                            onClick={handlePunchAndRestartScan}
                            className={styles.punchButton}
                            disabled={!scanResult || isProcessingPunch}
                        >
                            PUNCH!
                        </button>
                        <button
                            onClick={handleResetScan}
                            className={styles.resetButton}
                            disabled={!scanResult || isProcessingPunch}
                        >
                            Reset
                        </button>
                    </div>
                )}

                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                {punchMessage && <p className={styles.punchSuccessMessage}>{punchMessage}</p>}
                {!scanResult && !isCameraInitialized && !errorMessage && (
                    <p className={styles.initializingMessage}>Initializing Camera...</p>
                )}
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Test Punch Button and Message Area */}
            <button onClick={handleTestPunch} className={styles.testPunchButton}>
                Test Punch (User: ...e6ac)
            </button>
            {testPunchMessage && <p style={{ marginTop: '10px', color: testPunchMessage.startsWith('Test Punch Error:') ? 'red' : 'green' }}>{testPunchMessage}</p>}
        </div>
        </>
    );
};

export default ScannerPage; 