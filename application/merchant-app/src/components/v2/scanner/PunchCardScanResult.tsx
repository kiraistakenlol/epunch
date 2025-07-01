import React, { useEffect, useState } from 'react'
import { apiClient } from 'e-punch-common-ui'
import { PunchCardDto, LoyaltyProgramDto } from 'e-punch-common-core'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, Gift, ArrowLeft, CheckCircle } from 'lucide-react'
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
         // Assume we need to fetch loyalty program separately or it's included in cardData
         if (cardData.loyaltyProgramId) {
           const programData = await apiClient.getLoyaltyProgram(cardData.loyaltyProgramId)
           setLoyaltyProgram(programData)
         }
      } catch (error: any) {
        console.error('Failed to fetch punch card data:', error)
        setError(error.response?.data?.message || error.message || 'Failed to load punch card data')
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
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Loading punch card details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center space-y-6 p-4", className)}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onReset} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scanner
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!punchCard || !loyaltyProgram) {
    return (
      <div className={cn("flex flex-col items-center space-y-6 p-4", className)}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Punch Card Not Found</CardTitle>
            <CardDescription>The scanned punch card could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onReset} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scanner
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

     const isComplete = punchCard.currentPunches >= loyaltyProgram.requiredPunches
   const isRedeemed = punchCard.status === 'redeemed'

  return (
    <div className={cn("flex flex-col items-center space-y-6 p-4", className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <Badge variant={isRedeemed ? "destructive" : isComplete ? "default" : "secondary"}>
              {isRedeemed ? "Redeemed" : isComplete ? "Complete" : "In Progress"}
            </Badge>
          </div>
          <CardTitle className="text-xl">Punch Card Scan</CardTitle>
          <CardDescription>
            Card ID: {getPunchCardId()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">{loyaltyProgram.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {loyaltyProgram.rewardDescription}
              </p>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-background rounded-full h-2">
                                     <div 
                     className="bg-primary h-2 rounded-full transition-all duration-300"
                     style={{ width: `${Math.min((punchCard.currentPunches / loyaltyProgram.requiredPunches) * 100, 100)}%` }}
                   />
                 </div>
                 <span className="text-sm font-medium">
                   {punchCard.currentPunches} / {loyaltyProgram.requiredPunches}
                </span>
              </div>
            </div>

            {isRedeemed && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2 text-destructive">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Already Redeemed</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This punch card has already been redeemed.
                </p>
              </div>
            )}

            {!isRedeemed && !isComplete && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                                 <p className="text-sm text-muted-foreground">
                   This punch card is not yet complete. Customer needs {loyaltyProgram.requiredPunches - punchCard.currentPunches} more punch(es) to earn the reward.
                 </p>
              </div>
            )}

            {!isRedeemed && isComplete && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center space-x-2 text-primary">
                  <Gift className="h-4 w-4" />
                  <span className="text-sm font-medium">Ready for Redemption!</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This punch card is complete and ready to be redeemed.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scanner
            </Button>
            
            <Button 
              onClick={onRedeem}
              disabled={isRedeemed || !isComplete}
              className="flex-1"
            >
              <Gift className="w-4 h-4 mr-2" />
              Redeem Reward
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 