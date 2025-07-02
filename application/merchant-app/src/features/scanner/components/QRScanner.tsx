import React from 'react'
import { ScannerCamera } from './ScannerCamera'
import { QRScanResult } from './hooks/useScanner'

interface QRScannerProps {
  onScanResult: (result: QRScanResult) => void
  onError: (error: string) => void
  className?: string
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScanResult,
  onError,
  className
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      <ScannerCamera
        isActive={true}
        onScanResult={onScanResult}
        onError={onError}
        className={className}
      />
      
      <div className="text-center text-sm text-muted-foreground max-w-sm">
        <p>Position the QR code within the frame above. The scanner will automatically detect and process the code.</p>
      </div>
    </div>
  )
} 