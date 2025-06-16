import React from 'react';
import { QRValueDto } from 'e-punch-common-core';
import { ScannerCamera } from './ScannerCamera';
import { EpunchSpinner } from '../../../components/foundational';
import styles from './QRScanner.module.css';

interface QRScanResult {
    qrData: string;
    parsedData: QRValueDto;
}

interface ScannerProps {
    onScanResult: (result: QRScanResult) => void;
    onError: (error: string) => void;
}

export const QRScanner: React.FC<ScannerProps> = ({ onScanResult, onError }) => {
    return (
        <div className={styles.scannerContainer}>
            <div className={styles.scannerHeader}>
                <p className={styles.scannerHeaderText}>
                    Point camera at customer QR code
                </p>
            </div>

            <ScannerCamera
                isActive={true}
                onScanResult={onScanResult}
                onError={onError}
            >
                {({ videoRef, canvasRef, isCameraInitialized }) => (
                    <div className={styles.cameraContainer}>
                        <video
                            ref={videoRef}
                            className={`${styles.cameraVideo} ${
                                isCameraInitialized 
                                    ? styles.cameraVideoVisible 
                                    : styles.cameraVideoHidden
                            }`}
                            playsInline
                            muted
                        />
                        
                        {!isCameraInitialized && (
                            <div className={styles.cameraLoading}>
                                <EpunchSpinner text="Initializing Camera..." />
                            </div>
                        )}
                        
                        <canvas ref={canvasRef} className={styles.cameraCanvas} />
                    </div>
                )}
            </ScannerCamera>
        </div>
    );
}; 