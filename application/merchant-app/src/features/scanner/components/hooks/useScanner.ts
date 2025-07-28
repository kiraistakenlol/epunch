import { useState, useCallback } from 'react'
import { QRValueDto } from 'e-punch-common-core'
import { apiClient } from 'e-punch-common-ui'
import { toast } from 'sonner'

export type ScannerState = 'scanning' | 'userQR' | 'punchCardQR' | 'bundleQR' | 'processing'

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

  const handleUseBundle = useCallback(async (quantityUsed: number = 1) => {
    if (!scanResult?.parsedData || scanResult.parsedData.type !== 'bundle_id') return

    setCurrentState('processing')
    setIsProcessing(true)

    try {
      const result = await apiClient.useBundle(scanResult.parsedData.bundle_id, { quantityUsed })
      const message = `✅ Bundle used! ${quantityUsed} ${result.bundleProgram.itemName}(s)`
      
      toast.success("Success", {
        description: message,
        duration: 3000,
      })
      options.onSuccess?.(message)
      handleReset()
    } catch (error: any) {
      console.error('Bundle use operation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Bundle use operation failed.'
      
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
    handleUseBundle
  }
} 