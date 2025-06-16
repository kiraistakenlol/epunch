import React from 'react';
import { QRValueDto } from 'e-punch-common-core';
import { QRScanner } from './QRScannerLogic';
import { EpunchBox, EpunchTypography } from '../../../components/foundational';

interface QRScanResult {
    qrData: string;
    parsedData: QRValueDto;
}

interface ScannerProps {
    onScanResult: (result: QRScanResult) => void;
    onError: (error: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanResult, onError }) => {
    return (
        <EpunchBox>
            <EpunchBox textAlign="center" mb={3}>
                <EpunchTypography color="light">
                    Point camera at customer QR code
                </EpunchTypography>
            </EpunchBox>

            <QRScanner
                isActive={true}
                onScanResult={onScanResult}
                onError={onError}
            >
                {({ videoRef, canvasRef, isCameraInitialized }) => (
                    <EpunchBox
                        width="100%"
                        maxWidth={400}
                        borderRadius="12px"
                        overflow="hidden"
                        mx="auto"
                        boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
                    >
                        <video
                            ref={videoRef}
                            style={{ 
                                width: '100%', 
                                height: 'auto',
                                display: isCameraInitialized ? 'block' : 'none' 
                            }}
                            playsInline
                            muted
                        />
                        
                        {!isCameraInitialized && (
                            <EpunchBox 
                                height={300} 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center"
                                color="#f5f5dc"
                            >
                                <EpunchTypography>Initializing Camera...</EpunchTypography>
                            </EpunchBox>
                        )}
                        
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </EpunchBox>
                )}
            </QRScanner>
        </EpunchBox>
    );
}; 