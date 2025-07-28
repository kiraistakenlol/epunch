import React, { useEffect, useState } from 'react'
import { apiClient } from 'e-punch-common-ui'
import { BundleDto } from 'e-punch-common-core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Package, ArrowLeft, AlertCircle, CheckCircle, Plus, Minus } from 'lucide-react'
import { QRScanResult } from './hooks/useScanner'
import { cn } from '@/lib/cn'



interface BundleScanResultProps {
  data: QRScanResult
  onUseBundle: (quantity: number) => void
  onReset: () => void
  className?: string
}

export const BundleScanResult: React.FC<BundleScanResultProps> = ({
  data,
  onUseBundle,
  onReset,
  className
}) => {
  const [bundle, setBundle] = useState<BundleDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantityToUse, setQuantityToUse] = useState(1)

  useEffect(() => {
    const fetchBundleData = async () => {
      if (data.parsedData.type !== 'bundle_id') return

      setIsLoading(true)
      setError(null)

      try {
        const bundleData = await apiClient.getBundleById(data.parsedData.bundle_id)
        setBundle(bundleData)
      } catch (error: any) {
        console.error('Failed to fetch bundle data:', error)
        setError(error.response?.data?.message || error.message || 'Failed to load bundle')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBundleData()
  }, [data.parsedData])

  const getBundleId = () => {
    if (data.parsedData.type === 'bundle_id') {
      return data.parsedData.bundle_id.substring(0, 8) + '...'
    }
    return 'Unknown'
  }

  const isExpired = bundle?.expiresAt && new Date(bundle.expiresAt) < new Date()
  const isAvailable = bundle?.remainingQuantity && bundle.remainingQuantity > 0
  const isValidQuantity = quantityToUse >= 1 && quantityToUse <= (bundle?.remainingQuantity || 0)
  const maxQuantity = Math.min(quantityToUse, bundle?.remainingQuantity || 1)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading bundle...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("p-4", className)}>
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg text-destructive flex items-center justify-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Error</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardHeader>
          <CardContent>
            <Button onClick={onReset} className="w-full h-12">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!bundle) {
    return (
      <div className={cn("p-4", className)}>
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">Bundle Not Found</CardTitle>
            <p className="text-sm text-muted-foreground">Scanned bundle not found</p>
          </CardHeader>
          <CardContent>
            <Button onClick={onReset} className="w-full h-12">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = () => {
    if (isExpired) return <Badge variant="destructive" className="text-sm px-3 py-1">Expired</Badge>
    if (!isAvailable) return <Badge variant="destructive" className="text-sm px-3 py-1">Used Up</Badge>
    return <Badge variant="default" className="text-sm px-3 py-1">Available</Badge>
  }

  const handleUse = () => {
    const quantity = Math.max(1, Math.min(quantityToUse, bundle.remainingQuantity))
    onUseBundle(quantity)
  }

  const incrementQuantity = () => {
    if (bundle) {
      if (quantityToUse === 0) {
        setQuantityToUse(1)
      } else if (quantityToUse < bundle.remainingQuantity) {
        setQuantityToUse(quantityToUse + 1)
      }
    }
  }

  const decrementQuantity = () => {
    if (quantityToUse > 1) {
      setQuantityToUse(quantityToUse - 1)
    } else if (quantityToUse === 0) {
      setQuantityToUse(1)
    }
  }

  return (
    <div className={cn("p-2 sm:p-4 max-h-[90vh] flex flex-col w-full", className)}>
      <Card className="flex-1 flex flex-col w-full">
        <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="flex items-center justify-center space-x-3 mb-2 sm:mb-3">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            {getStatusBadge()}
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center">{bundle.itemName} Bundle</CardTitle>
          <p className="text-xs sm:text-sm text-center text-muted-foreground">ID: {getBundleId()}</p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="flex-1 space-y-4 sm:space-y-6">
            <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <h4 className="font-medium text-base sm:text-lg">{bundle.merchant.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg">📦</span>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {bundle.remainingQuantity} of {bundle.originalQuantity} {bundle.itemName}(s) remaining
                  </p>
                </div>
                {bundle.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    {bundle.description}
                  </p>
                )}
              </div>
            </div>

            {isExpired && (
              <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    Expired on {new Date(bundle.expiresAt!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {!isAvailable && !isExpired && (
              <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2 text-destructive">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">All items have been used</span>
                </div>
              </div>
            )}

            {isAvailable && !isExpired && bundle.remainingQuantity > 0 && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity to use
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0 shrink-0"
                      onClick={decrementQuantity}
                      disabled={quantityToUse === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={bundle.remainingQuantity}
                      value={quantityToUse || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '') {
                          setQuantityToUse(0)
                        } else {
                          const numValue = parseInt(value)
                          if (!isNaN(numValue)) {
                            setQuantityToUse(numValue)
                          }
                        }
                      }}
                      className={cn(
                        "text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        !isValidQuantity && quantityToUse !== 0 && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder="0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0 shrink-0"
                      onClick={incrementQuantity}
                      disabled={quantityToUse >= bundle.remainingQuantity && quantityToUse > 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {!isValidQuantity && quantityToUse > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      {quantityToUse > bundle.remainingQuantity 
                        ? `Only ${bundle.remainingQuantity} available`
                        : 'Quantity must be at least 1'
                      }
                    </p>
                  )}
                </div>
              </div>
            )}

            {bundle.expiresAt && !isExpired && (
              <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs sm:text-sm text-amber-700">
                  Expires on {new Date(bundle.expiresAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4 mt-auto flex-shrink-0 px-4 sm:px-6">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="w-1/2 h-12 sm:h-14 text-sm sm:text-base flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Back
            </Button>
            
            <Button 
              onClick={handleUse}
              disabled={!isAvailable || !!isExpired || !isValidQuantity}
              className="w-1/2 h-12 sm:h-14 text-sm sm:text-base flex items-center justify-center"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              {!isValidQuantity ? 'Use' : `Use (${maxQuantity})`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 