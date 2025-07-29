import React, { useState } from 'react'
import { BundleProgramDto, BundleCreateDto } from 'e-punch-common-core'
import { apiClient } from 'e-punch-common-ui'
import { Button } from '@/components/ui/button'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Loader2, Package } from 'lucide-react'

import { toast } from 'sonner'

interface BundlesTabProps {
  activeBundlePrograms: BundleProgramDto[]
  selectedBundleProgramId: string
  selectedBundlePresetIndex: number
  onBundleProgramSelect: (programId: string) => void
  onPresetSelect: (index: number) => void
  userId: string
  onSuccess: (message: string) => void
}

export const BundlesTab: React.FC<BundlesTabProps> = ({
  activeBundlePrograms,
  selectedBundleProgramId,
  selectedBundlePresetIndex,
  onBundleProgramSelect,
  onPresetSelect,
  userId,
  onSuccess
}) => {
  const [customQuantity, setCustomQuantity] = useState<number>(1)
  const [customValidityDays, setCustomValidityDays] = useState<number | null>(null)
  const [isGivingBundle, setIsGivingBundle] = useState(false)
  const [showBundleConfirmation, setShowBundleConfirmation] = useState(false)

  // Update custom inputs when preset is selected
  React.useEffect(() => {
    if (selectedBundleProgramId) {
      const selectedProgram = activeBundlePrograms.find(p => p.id === selectedBundleProgramId)
      if (selectedProgram && selectedProgram.quantityPresets[selectedBundlePresetIndex]) {
        const preset = selectedProgram.quantityPresets[selectedBundlePresetIndex]
        setCustomQuantity(preset.quantity)
        setCustomValidityDays(preset.validityDays)
      }
    }
  }, [selectedBundleProgramId, selectedBundlePresetIndex, activeBundlePrograms])

  const getSelectedBundleInfo = () => {
    const selectedProgram = activeBundlePrograms.find(p => p.id === selectedBundleProgramId)
    if (!selectedProgram) return null
    
    return {
      programName: selectedProgram.name,
      itemName: selectedProgram.itemName,
      quantity: customQuantity,
      validityDays: customValidityDays
    }
  }

  const handleGiveBundle = async () => {
    if (!selectedBundleProgramId || !userId) return
    
    setShowBundleConfirmation(false)
    setIsGivingBundle(true)

    try {
      const bundleData: BundleCreateDto = {
        userId,
        bundleProgramId: selectedBundleProgramId,
        quantity: customQuantity,
        validityDays: customValidityDays || undefined
      }
      
      const result = await apiClient.createBundle(bundleData)
      const message = `🎁 Bundle given! ${customQuantity}x ${result.itemName}`
      
      toast.success("Success", {
        description: message,
        duration: 3000,
      })
      onSuccess(message)
    } catch (error: any) {
      console.error('Give bundle operation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Give bundle operation failed.'
      
      toast.error("Error", {
        description: errorMessage,
        duration: 4000,
      })
    } finally {
      setIsGivingBundle(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 1. Bundle Program Selector */}
      <div className="space-y-2 mb-6">
        <Label className="text-sm font-medium">Bundle Program</Label>
        <Select
          value={selectedBundleProgramId}
          onValueChange={onBundleProgramSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a bundle program" />
          </SelectTrigger>
          <SelectContent>
            {activeBundlePrograms.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>{program.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 2. Setting Details */}
      <div className="flex-1 space-y-4 mb-6">
        {selectedBundleProgramId ? (
          <>
            {/* Presets */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {activeBundlePrograms
                  .find(p => p.id === selectedBundleProgramId)
                  ?.quantityPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant={selectedBundlePresetIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPresetSelect(index)}
                      className="text-xs"
                    >
                      {preset.quantity}x
                      {preset.validityDays && ` • ${preset.validityDays}d`}
                    </Button>
                  ))}
              </div>
            </div>


          </>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">Select a bundle program to configure details</p>
          </div>
        )}
      </div>

      {/* 3. Give Button */}
      <div className="pt-4 border-t">
        <AlertDialog open={showBundleConfirmation} onOpenChange={setShowBundleConfirmation}>
          <AlertDialogTrigger asChild>
            <Button 
              disabled={isGivingBundle || !selectedBundleProgramId || customQuantity < 1}
              className="w-full h-12"
            >
              {isGivingBundle ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Giving Bundle...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Give Bundle
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Bundle Gift</AlertDialogTitle>
              <AlertDialogDescription>
                {(() => {
                  const bundleInfo = getSelectedBundleInfo()
                  if (!bundleInfo) return null
                  
                  return (
                    <div className="space-y-2 mt-3">
                      <p>You are about to give the following bundle to this customer:</p>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Package className="w-4 h-4 text-primary" />
                          <span className="font-medium">{bundleInfo.programName}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>{bundleInfo.quantity}x</strong> {bundleInfo.itemName}
                          {bundleInfo.validityDays && (
                            <span> • Expires in {bundleInfo.validityDays} days</span>
                          )}
                        </p>
                      </div>
                      <p className="text-sm">This action cannot be undone.</p>
                    </div>
                  )
                })()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleGiveBundle}>
                Confirm Give Bundle
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
} 