import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { QRScanner } from './QRScanner'
import { CustomerScanResult } from './CustomerScanResult'
import { PunchCardScanResult } from './PunchCardScanResult'
import { useScanner } from './hooks/useScanner'
import { cn } from '@/lib/cn'

interface ScannerInterfaceProps {
  className?: string
  title?: string
}

export const ScannerInterface: React.FC<ScannerInterfaceProps> = ({
  className,
}) => {
  const scanner = useScanner()

  const renderCurrentState = () => {
    switch (scanner.currentState) {
      case 'scanning':
        return (
          <QRScanner
            onScanResult={scanner.handleScanResult}
            onError={scanner.handleError}
          />
        )
      
      case 'userQR':
        return scanner.scanResult ? (
          <CustomerScanResult
            onPunch={scanner.handlePunch}
            onReset={scanner.handleReset}
          />
        ) : null
      
      case 'punchCardQR':
        return scanner.scanResult ? (
          <PunchCardScanResult
            data={scanner.scanResult}
            onRedeem={scanner.handleRedeem}
            onReset={scanner.handleReset}
          />
        ) : null
      
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <Card className="w-full max-w-md">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Processing...</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Please wait while we process your request.
                </p>
              </CardContent>
            </Card>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {renderCurrentState()}
    </div>
  )
} 