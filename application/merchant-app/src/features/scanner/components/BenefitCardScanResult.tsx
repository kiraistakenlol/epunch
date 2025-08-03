import React, { useEffect, useState } from 'react'
import { apiClient } from 'e-punch-common-ui'
import { BenefitCardDto } from 'e-punch-common-core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Gift, ArrowLeft, AlertCircle } from 'lucide-react'
import { QRScanResult } from './hooks/useScanner'
import { cn } from '@/lib/cn'

interface BenefitCardScanResultProps {
  data: QRScanResult
  onReset: () => void
  className?: string
}

export const BenefitCardScanResult: React.FC<BenefitCardScanResultProps> = ({
  data,
  onReset,
  className
}) => {
  const [benefitCard, setBenefitCard] = useState<BenefitCardDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBenefitCardData = async () => {
      if (data.parsedData.type !== 'benefit_card_id') return

      setIsLoading(true)
      setError(null)

      try {
        const benefitCardData = await apiClient.getBenefitCardById(data.parsedData.benefit_card_id)
        setBenefitCard(benefitCardData)
      } catch (error: any) {
        console.error('Failed to fetch benefit card data:', error)
        setError(error.response?.data?.message || error.message || 'Failed to load benefit card')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBenefitCardData()
  }, [data.parsedData])

  const getBenefitCardId = () => {
    if (data.parsedData.type === 'benefit_card_id') {
      return data.parsedData.benefit_card_id.substring(0, 8) + '...'
    }
    return 'Unknown'
  }

  const isExpired = benefitCard?.expiresAt && new Date(benefitCard.expiresAt) < new Date()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading benefit card...</p>
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

  if (!benefitCard) {
    return (
      <div className={cn("p-4", className)}>
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">Benefit Card Not Found</CardTitle>
            <p className="text-sm text-muted-foreground">Scanned benefit card not found</p>
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
    return <Badge variant="default" className="text-sm px-3 py-1">Active</Badge>
  }

  return (
    <div className={cn("p-2 sm:p-4 max-h-[90vh] flex flex-col w-full", className)}>
      <Card className="flex-1 flex flex-col w-full">
        <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="flex items-center justify-center space-x-3 mb-2 sm:mb-3">
            <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            {getStatusBadge()}
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center">Benefit Card</CardTitle>
          <p className="text-xs sm:text-sm text-center text-muted-foreground">ID: {getBenefitCardId()}</p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="flex-1 space-y-4 sm:space-y-6">
            <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <h4 className="font-medium text-base sm:text-lg">{benefitCard.merchant.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg">🎁</span>
                  <p className="text-sm sm:text-base font-medium">
                    {benefitCard.itemName}
                  </p>
                </div>
              </div>
            </div>

            {isExpired && (
              <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    Expired on {new Date(benefitCard.expiresAt!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {benefitCard.expiresAt && !isExpired && (
              <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs sm:text-sm text-amber-700">
                  Expires on {new Date(benefitCard.expiresAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-3 sm:pt-4 mt-auto flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="w-full max-w-xs h-12 sm:h-14 text-sm sm:text-base flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}