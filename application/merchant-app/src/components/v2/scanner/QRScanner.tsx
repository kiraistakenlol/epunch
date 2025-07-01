import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScannerCamera } from './ScannerCamera'
import { QRScanResult } from './hooks/useScanner'

interface QRScannerProps {
  onScanResult: (result: QRScanResult) => void
  onError: (error: string) => void
  title?: string
  description?: string
  className?: string
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScanResult,
  onError,
  title = "QR Code Scanner",
  description = "Point camera at customer QR code or punch card",
  className
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
      
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