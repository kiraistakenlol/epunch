import React, { useEffect, useState } from 'react'
import { apiClient } from 'e-punch-common-ui'
import { PunchCardDto, LoyaltyProgramDto } from 'e-punch-common-core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, Gift, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { QRScanResult } from './hooks/useScanner'
import { cn } from '@/lib/utils'

interface PunchCardScanResultProps {
  data: QRScanResult
  onRedeem: () => void
  onReset: () => void
  className?: string
}

export const PunchCardScanResult: React.FC<PunchCardScanResultProps> = ({
  data,
  onRedeem,
  onReset,
  className
}) => {
  const [punchCard, setPunchCard] = useState<PunchCardDto | null>(null)
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgramDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPunchCardData = async () => {
      if (data.parsedData.type !== 'redemption_punch_card_id') return

      setIsLoading(true)
      setError(null)

      try {
        const cardData = await apiClient.getPunchCard(data.parsedData.punch_card_id)
        setPunchCard(cardData)
        if (cardData.loyaltyProgramId) {
          const programData = await apiClient.getLoyaltyProgram(cardData.loyaltyProgramId)
          setLoyaltyProgram(programData)
        }
      } catch (error: any) {
        console.error('Failed to fetch punch card data:', error)
        setError(error.response?.data?.message || error.message || 'Failed to load card')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPunchCardData()
  }, [data.parsedData])

  const getPunchCardId = () => {
    if (data.parsedData.type === 'redemption_punch_card_id') {
      return data.parsedData.punch_card_id.substring(0, 8) + '...'
    }
    return 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading card...</p>
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

  if (!punchCard || !loyaltyProgram) {
    return (
      <div className={cn("p-4", className)}>
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">Card Not Found</CardTitle>
            <p className="text-sm text-muted-foreground">Scanned card not found</p>
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

  const isComplete = punchCard.currentPunches >= loyaltyProgram.requiredPunches
  const isRedeemed = punchCard.status === 'REWARD_REDEEMED'

  const getStatusBadge = () => {
    if (isRedeemed) return <Badge variant="destructive" className="text-sm px-3 py-1">Redeemed</Badge>
    if (isComplete) return <Badge variant="default" className="text-sm px-3 py-1">Ready</Badge>
    return <Badge variant="secondary" className="text-sm px-3 py-1">In Progress</Badge>
  }

  return (
    <div className={cn("p-4", className)}>
      <Card>
        <CardHeader className="pb-6">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <CreditCard className="h-6 w-6 text-primary" />
            {getStatusBadge()}
          </div>
          <CardTitle className="text-2xl text-center">Punch Card</CardTitle>
          <p className="text-sm text-center text-muted-foreground">ID: {getPunchCardId()}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <h4 className="font-medium text-lg">{loyaltyProgram.name}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎁</span>
                <p className="text-sm text-muted-foreground">{loyaltyProgram.rewardDescription}</p>
              </div>
            </div>
          </div>

          {isRedeemed && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2 text-destructive">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Already redeemed</span>
              </div>
            </div>
          )}

          {!isRedeemed && !isComplete && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700">
                Needs {loyaltyProgram.requiredPunches - punchCard.currentPunches} more punch(es)
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="flex-1 h-14 text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            
            <Button 
              onClick={onRedeem}
              disabled={isRedeemed || !isComplete}
              className="flex-1 h-14 text-base"
            >
              <Gift className="w-5 h-5 mr-2" />
              Redeem
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 