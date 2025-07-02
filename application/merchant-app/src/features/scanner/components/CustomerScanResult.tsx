import React, { useEffect, useState } from 'react'
import { apiClient } from 'e-punch-common-ui'
import { LoyaltyProgramDto } from 'e-punch-common-core'
import { useAppSelector } from '../../../store/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, User, Gift, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CustomerScanResultProps {
  onPunch: (loyaltyProgramId: string) => void
  onReset: () => void
  className?: string
}

export const CustomerScanResult: React.FC<CustomerScanResultProps> = ({
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className={cn("p-2 sm:p-4 max-h-[90vh] flex flex-col w-full", className)}>
      <Card className="flex-1 flex flex-col w-full">
        <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="flex items-center justify-center space-x-3 mb-2 sm:mb-3">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">Customer</Badge>
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center">Ready to Punch</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6 px-4 sm:px-6">
          {loyaltyPrograms.length === 0 ? (
            <div className="text-center py-4 sm:py-6">
              <p className="text-sm sm:text-base text-muted-foreground">No active programs</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-2 sm:space-y-3">
              <p className="text-sm sm:text-base font-medium text-muted-foreground">Select a program:</p>
              <div className="flex-1 max-h-[calc(90vh-280px)] min-h-[180px] sm:min-h-[200px] overflow-y-auto space-y-2 sm:space-y-3 pr-1 sm:pr-2">
                {loyaltyPrograms.map((program) => (
                  <div
                    key={program.id}
                    onClick={() => setSelectedLoyaltyProgramId(program.id)}
                    className={cn(
                      "p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                      "hover:shadow-md active:scale-[0.98] min-h-[56px] sm:min-h-[60px]",
                      selectedLoyaltyProgramId === program.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-background hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                          <span className="text-sm sm:text-base">🎁</span>
                          <h3 className="font-medium text-sm sm:text-base leading-tight">{program.name}</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {program.requiredPunches} punches → {program.rewardDescription}
                        </p>
                      </div>
                      {selectedLoyaltyProgramId === program.id && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
              onClick={handlePunch}
              disabled={!selectedLoyaltyProgramId || loyaltyPrograms.length === 0}
              className="w-1/2 h-12 sm:h-14 text-sm sm:text-base flex items-center justify-center"
            >
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Punch
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 