import React, { useEffect, useState, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { QRValueDto } from 'e-punch-common-core';

interface QRScanResult {
    qrData: string;
    parsedData: QRValueDto;
}

interface QRScannerLogicProps {
    isActive: boolean;
    onScanResult: (result: QRScanResult) => void;
    onError: (error: string) => void;
    children: (props: {
        videoRef: React.RefObject<HTMLVideoElement>;
        canvasRef: React.RefObject<HTMLCanvasElement>;
        isCameraInitialized: boolean;
    }) => React.ReactNode;
}

export const QRScanner: React.FC<QRScannerLogicProps> = ({
    isActive,
    onScanResult,
    onError,
    children
}) => {
    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    const streamRef = useRef<MediaStream | null>(null);

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
            if (streamRef.current?.active && isActive) {
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
                        onScanResult({
                            qrData: code.data,
                            parsedData: parsed
                        });
                        stopVideoStream();
                        return;
                    } else {
                        console.warn("Invalid QR format detected, continuing scan...");
                    }
                }
            } catch (error) {
                // Silent error for continuous scanning
            }
        }
        if (streamRef.current?.active && isActive) {
            requestRef.current = requestAnimationFrame(scanFrame);
        }
    }, [isActive, onScanResult]);

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
        if (streamRef.current || !isActive) {
            console.log("Video stream start prevented. Current state:", {
                hasStream: !!streamRef.current,
                isActive
            });
            return;
        }

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
                if (isActive) {
                    requestRef.current = requestAnimationFrame(scanFrame);
                }
            } else {
                throw new Error("Video element not available.");
            }
        } catch (err: any) {
            console.error("Error starting video stream:", err);
            onError(`Camera error: ${err.name || err.message || err}`);
            setIsCameraInitialized(false);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
    }, [scanFrame, isActive, onError]);

    useEffect(() => {
        if (isActive) {
            startVideoStream();
        } else {
            stopVideoStream();
            setIsCameraInitialized(false);
        }
        
        return () => {
            console.log("QRScannerLogic unmounting, stopping video stream.");
            stopVideoStream();
        };
    }, [isActive, startVideoStream, stopVideoStream]);

    return (
        <>
            {children({
                videoRef,
                canvasRef,
                isCameraInitialized
            })}
        </>
    );
}; 