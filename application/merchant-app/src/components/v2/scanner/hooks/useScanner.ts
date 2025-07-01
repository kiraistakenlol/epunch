import { useState, useCallback } from 'react'
import { QRValueDto } from 'e-punch-common-core'
import { apiClient } from 'e-punch-common-ui'
import { toast } from 'sonner'

export type ScannerState = 'scanning' | 'userQR' | 'punchCardQR' | 'processing'

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
    }
  }, [])

  const handleError = useCallback((error: string) => {
    console.error('Scanner error:', error)
    toast.error(error)
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
      
      toast.success(message)
      options.onSuccess?.(message)
      
      setTimeout(() => handleReset(), 2000)
    } catch (error: any) {
      console.error('Punch operation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Punch operation failed.'
      
      toast.error(errorMessage)
      options.onError?.(errorMessage)
      
      setTimeout(() => handleReset(), 3000)
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
      
      toast.success(message)
      options.onSuccess?.(message)
      
      setTimeout(() => handleReset(), 2000)
    } catch (error: any) {
      console.error('Redeem operation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Redeem operation failed.'
      
      toast.error(errorMessage)
      options.onError?.(errorMessage)
      
      setTimeout(() => handleReset(), 3000)
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
    handleRedeem
  }
} 