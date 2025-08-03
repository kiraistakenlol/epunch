import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Package } from 'lucide-react'
import { QRScanner } from './QRScanner'
import { CustomerScanResult } from './CustomerScanResult'
import { PunchCardScanResult } from './PunchCardScanResult'
import { BundleScanResult } from './BundleScanResult'
import { BenefitCardScanResult } from './BenefitCardScanResult'
import { useScanner } from './hooks/useScanner'
import { cn } from '@/lib/cn'

// Development flag - set to true to show mock bundle button
const SHOW_DEV_BUTTONS = false

interface ScannerInterfaceProps {
  className?: string
  title?: string
}

export const ScannerInterface: React.FC<ScannerInterfaceProps> = ({
  className,
}) => {
  const scanner = useScanner()
  const [mockBundleIndex, setMockBundleIndex] = React.useState(0)

  const handleMockBundleScan = () => {
    // Cycle through different mock bundles
    const bundleId = `mock-bundle-${mockBundleIndex}`
    const mockBundleQR = {
      qrData: JSON.stringify({ type: 'bundle_id', bundle_id: bundleId }),
      parsedData: {
        type: 'bundle_id' as const,
        bundle_id: bundleId
      }
    }
    scanner.handleScanResult(mockBundleQR)
    setMockBundleIndex((prev) => (prev + 1) % 4) // Cycle through 4 mock bundles
  }

  const renderCurrentState = () => {
    switch (scanner.currentState) {
      case 'scanning':
        return (
          <div className="space-y-4">
            <QRScanner
              onScanResult={scanner.handleScanResult}
              onError={scanner.handleError}
            />
            
            {SHOW_DEV_BUTTONS && (
              <Card className="w-full max-w-lg mx-auto">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-center text-muted-foreground">
                      Development Tools
                    </h3>
                    <Button 
                      onClick={handleMockBundleScan}
                      variant="outline"
                      className="w-full"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Test Bundle Scan ({mockBundleIndex + 1}/4)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )
      
      case 'userQR':
        return scanner.scanResult && scanner.scanResult.parsedData.type === 'user_id' ? (
          <CustomerScanResult
            onPunch={scanner.handlePunch}
            onReset={scanner.handleReset}
            onSuccess={() => scanner.handleReset()}
            userId={scanner.scanResult.parsedData.user_id}
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
      
      case 'bundleQR':
        return scanner.scanResult ? (
          <BundleScanResult
            data={scanner.scanResult}
            onUseBundle={scanner.handleUpdateBundle}
            onReset={scanner.handleReset}
          />
        ) : null
      
      case 'benefitCardQR':
        return scanner.scanResult ? (
          <BenefitCardScanResult
            data={scanner.scanResult}
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