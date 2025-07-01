import React, { useEffect, useState } from 'react'
import { apiClient } from 'e-punch-common-ui'
import { LoyaltyProgramDto } from 'e-punch-common-core'
import { useAppSelector } from '../../../store/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, User, Gift, ArrowLeft } from 'lucide-react'
import { QRScanResult } from './hooks/useScanner'
import { cn } from '@/lib/utils'

interface CustomerScanResultProps {
  data: QRScanResult
  onPunch: (loyaltyProgramId: string) => void
  onReset: () => void
  className?: string
}

export const CustomerScanResult: React.FC<CustomerScanResultProps> = ({
  data,
  onPunch,
  onReset,
  className
}) => {
  const merchantId = useAppSelector(state => state.merchant.merchant?.id)
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([])
  const [selectedLoyaltyProgramId, setSelectedLoyaltyProgramId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchLoyaltyPrograms = async () => {
      if (!merchantId) return

      setIsLoading(true)
      try {
        const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId)
        const activePrograms = programs.filter(p => p.isActive)
        setLoyaltyPrograms(activePrograms)
        
        if (activePrograms.length === 1) {
          setSelectedLoyaltyProgramId(activePrograms[0].id)
        }
      } catch (error: any) {
        console.error('Failed to fetch loyalty programs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoyaltyPrograms()
  }, [merchantId])

  const handlePunch = () => {
    if (selectedLoyaltyProgramId) {
      onPunch(selectedLoyaltyProgramId)
    }
  }

  const getDisplayUserId = () => {
    if (data.parsedData.type === 'user_id') {
      return data.parsedData.user_id.substring(0, 8) + '...'
    }
    return 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Loading loyalty programs...</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center space-y-6 p-4", className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <User className="h-5 w-5 text-primary" />
            <Badge variant="secondary">Customer QR</Badge>
          </div>
          <CardTitle className="text-xl">Customer Scan Success!</CardTitle>
          <CardDescription>
            User ID: {getDisplayUserId()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {loyaltyPrograms.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No active loyalty programs found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create a loyalty program to start recording punches.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Loyalty Program</label>
                <Select 
                  value={selectedLoyaltyProgramId} 
                  onValueChange={setSelectedLoyaltyProgramId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a program..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loyaltyPrograms.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{program.name}</span>
                                                     <span className="text-xs text-muted-foreground">
                             {program.requiredPunches} punches → {program.rewardDescription}
                           </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedLoyaltyProgramId && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Gift className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Program Details</span>
                  </div>
                  {(() => {
                    const program = loyaltyPrograms.find(p => p.id === selectedLoyaltyProgramId)
                    return program ? (
                      <div className="text-sm text-muted-foreground">
                        <p><strong>{program.name}</strong></p>
                        <p>Reward: {program.rewardDescription}</p>
                                                 <p>Required punches: {program.requiredPunches}</p>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </>
          )}
          
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
              onClick={handlePunch}
              disabled={!selectedLoyaltyProgramId || loyaltyPrograms.length === 0}
              className="flex-1"
            >
              <Gift className="w-4 h-4 mr-2" />
              Record Punch
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 