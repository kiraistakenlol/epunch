import { useState, useCallback } from 'react'
import { QRValueDto } from 'e-punch-common-core'
import { apiClient } from 'e-punch-common-ui'
import { toast } from 'sonner'

export type ScannerState = 'scanning' | 'userQR' | 'punchCardQR' | 'bundleQR' | 'benefitCardQR' | 'processing'

export interface QRScanResult {
  qrData: string
  parsedData: QRValueDto
}

export interface UseScannerOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export const useScanner = (options: UseScannerOptions = {}) => {
  const [currentState, setCurrentState] = useState<ScannerState>('scanning')
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleScanResult = useCallback((result: QRScanResult) => {
    setScanResult(result)
    
    if (result.parsedData.type === 'user_id') {
      setCurrentState('userQR')
    } else if (result.parsedData.type === 'redemption_punch_card_id') {
      setCurrentState('punchCardQR')
    } else if (result.parsedData.type === 'bundle_id') {
      setCurrentState('bundleQR')
    } else if (result.parsedData.type === 'benefit_card_id') {
      setCurrentState('benefitCardQR')
    }
  }, [])

  const handleError = useCallback((error: string) => {
    console.error('Scanner error:', error)
    toast.error('Scanner Error', {
      description: error,
      duration: 4000,
    })
    options.onError?.(error)
  }, [options])

  const handleReset = useCallback(() => {
    setCurrentState('scanning')
    setScanResult(null)
    setIsProcessing(false)
  }, [])

  const handlePunch = useCallback(async (loyaltyProgramId: string) => {
    if (!scanResult?.parsedData || scanResult.parsedData.type !== 'user_id') return

    setCurrentState('processing')
    setIsProcessing(true)

    try {
      const result = await apiClient.recordPunch(scanResult.parsedData.user_id, loyaltyProgramId)
      const message = result.rewardAchieved ? "🎉 Reward Achieved!" : "✅ Punch recorded!"
      
      toast.success("Success", {
        description: message,
        duration: 3000,
      })
      options.onSuccess?.(message)
      handleReset()
    } catch (error: any) {
      console.error('Punch operation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Punch operation failed.'
      
      toast.error("Error", {
        description: errorMessage,
        duration: 4000,
      })
      options.onError?.(errorMessage)
      
      setTimeout(() => handleReset(), 4500)
    } finally {
      setIsProcessing(false)
    }
  }, [scanResult, options, handleReset])

  const handleRedeem = useCallback(async () => {
    if (!scanResult?.parsedData || scanResult.parsedData.type !== 'redemption_punch_card_id') return

    setCurrentState('processing')
    setIsProcessing(true)

    try {
      const result = await apiClient.redeemPunchCard(scanResult.parsedData.punch_card_id)
      const message = `🎉 Reward Redeemed! ${result.shopName}`
      
      toast.success("Success", {
        description: message,
        duration: 3000,
      })
      options.onSuccess?.(message)
      handleReset()
    } catch (error: any) {
      console.error('Redeem operation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Redeem operation failed.'
      
      toast.error("Error", {
        description: errorMessage,
        duration: 4000,
      })
      options.onError?.(errorMessage)
      
      setTimeout(() => handleReset(), 4500)
    } finally {
      setIsProcessing(false)
    }
  }, [scanResult, options, handleReset])

  const handleUpdateBundle = useCallback(async (quantityToConsume: number = 1) => {
    if (!scanResult?.parsedData || scanResult.parsedData.type !== 'bundle_id') return

    setCurrentState('processing')
    setIsProcessing(true)

    try {
      const currentBundle = await apiClient.getBundleById(scanResult.parsedData.bundle_id)
      const newRemainingQuantity = currentBundle.remainingQuantity - quantityToConsume
      const result = await apiClient.updateBundle(scanResult.parsedData.bundle_id, { remainingQuantity: newRemainingQuantity })
      const message = `✅ Bundle used! ${quantityToConsume} ${result.itemName}(s)`
      
      toast.success("Success", {
        description: message,
        duration: 3000,
      })
      options.onSuccess?.(message)
      handleReset()
    } catch (error: any) {
      console.error('Bundle update error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Bundle update failed.'
      
      toast.error("Error", {
        description: errorMessage,
        duration: 4000,
      })
      options.onError?.(errorMessage)
      
      setTimeout(() => handleReset(), 4500)
    } finally {
      setIsProcessing(false)
    }
  }, [scanResult, options, handleReset])



  return {
    currentState,
    scanResult,
    isProcessing,
    handleScanResult,
    handleError,
    handleReset,
    handlePunch,
    handleRedeem,
    handleUpdateBundle
  }
} 