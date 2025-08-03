import React, { useState } from 'react'
import { BenefitCardCreateDto } from 'e-punch-common-core'
import { apiClient } from 'e-punch-common-ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Loader2, Gift } from 'lucide-react'
import { useAppSelector } from '../../../store/hooks'
import { toast } from 'sonner'

interface BenefitCardsTabProps {
  userId: string
  onSuccess: (message: string) => void
}

export const BenefitCardsTab: React.FC<BenefitCardsTabProps> = ({
  userId,
  onSuccess
}) => {
  const merchantId = useAppSelector(state => state.merchant.merchant?.id)
  const [itemName, setItemName] = useState<string>('')
  const [expiresAt, setExpiresAt] = useState<string>('')
  const [isGivingBenefitCard, setIsGivingBenefitCard] = useState(false)
  const [showBenefitCardConfirmation, setShowBenefitCardConfirmation] = useState(false)

  const handleGiveBenefitCard = async () => {
    if (!merchantId || !userId || !itemName.trim()) return
    
    setShowBenefitCardConfirmation(false)
    setIsGivingBenefitCard(true)

    try {
      const benefitCardData: BenefitCardCreateDto = {
        userId,
        merchantId,
        itemName: itemName.trim(),
        expiresAt: expiresAt || undefined
      }
      
      const result = await apiClient.createBenefitCard(benefitCardData)
      const message = `🎁 Benefit card given! ${result.itemName}`
      
      toast.success("Success", {
        description: message,
        duration: 3000,
      })
      onSuccess(message)
      
      // Reset form
      setItemName('')
      setExpiresAt('')
    } catch (error: any) {
      console.error('Give benefit card operation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Give benefit card operation failed.'
      
      toast.error("Error", {
        description: errorMessage,
        duration: 4000,
      })
    } finally {
      setIsGivingBenefitCard(false)
    }
  }

  const isFormValid = itemName.trim().length > 0

  return (
    <div className="h-full flex flex-col">
      {/* Form */}
      <div className="flex-1 space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="itemName" className="text-sm font-medium">
            Benefit Description *
          </Label>
          <Input
            id="itemName"
            type="text"
            placeholder="e.g., Free Coffee, 10% Discount, Priority Access"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt" className="text-sm font-medium">
            Expiration Date (Optional)
          </Label>
          <Input
            id="expiresAt"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0">
        <AlertDialog open={showBenefitCardConfirmation} onOpenChange={setShowBenefitCardConfirmation}>
          <AlertDialogTrigger asChild>
            <Button 
              className="w-full h-12 text-base"
              disabled={!isFormValid || isGivingBenefitCard}
            >
              {isGivingBenefitCard ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Giving...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Give Benefit Card
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Benefit Card</AlertDialogTitle>
              <AlertDialogDescription>
                Give benefit card: "{itemName}"
                {expiresAt && ` (expires on ${new Date(expiresAt).toLocaleDateString()})`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleGiveBenefitCard}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}