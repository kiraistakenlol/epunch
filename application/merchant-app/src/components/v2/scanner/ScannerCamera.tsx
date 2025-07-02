import React, { useEffect, useState, useRef, useCallback } from 'react'
import jsQR from 'jsqr'
import { QRValueDto } from 'e-punch-common-core'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Loader2, Camera, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QRScanResult {
  qrData: string
  parsedData: QRValueDto
}

interface ScannerCameraProps {
  isActive: boolean
  onScanResult: (result: QRScanResult) => void
  onError: (error: string) => void
  className?: string
}

export const ScannerCamera: React.FC<ScannerCameraProps> = ({
  isActive,
  onScanResult,
  onError,
  className
}) => {
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const streamRef = useRef<MediaStream | null>(null)

  const parseQRData = useCallback((qrString: string): QRValueDto | null => {
    try {
      const parsed = JSON.parse(qrString) as QRValueDto
      if (parsed.type === 'user_id' && parsed.user_id) {
        return parsed
      }
      if (parsed.type === 'redemption_punch_card_id' && parsed.punch_card_id) {
        return parsed
      }
      return null
    } catch (error) {
      console.error('Failed to parse QR data as JSON:', error)
      return null
    }
  }, [])

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      if (streamRef.current?.active && isActive) {
        requestRef.current = requestAnimationFrame(scanFrame)
      }
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d', { willReadFrequently: true })

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        })

        if (code && code.data) {
          console.log("QR Code detected:", code.data)
          const parsed = parseQRData(code.data)
          if (parsed) {
            onScanResult({
              qrData: code.data,
              parsedData: parsed
            })
            stopVideoStream()
            return
          } else {
            console.warn("Invalid QR format detected, continuing scan...")
          }
        }
      } catch (error) {
        // Silent error for continuous scanning
      }
    }
    
    if (streamRef.current?.active && isActive) {
      requestRef.current = requestAnimationFrame(scanFrame)
    }
  }, [isActive, onScanResult, parseQRData])

  const stopVideoStream = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      requestRef.current = undefined
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      console.log("Video stream stopped.")
    }
    setIsCameraInitialized(false)
  }, [])

  const startVideoStream = useCallback(async () => {
    if (streamRef.current || !isActive) {
      return
    }

    console.log("Attempting to start video stream...")
    setError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      streamRef.current = stream
      setHasPermission(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsCameraInitialized(true)
        console.log("Video stream started. Starting scan loop.")
        
        if (isActive) {
          requestRef.current = requestAnimationFrame(scanFrame)
        }
      }
    } catch (err: any) {
      console.error("Error starting video stream:", err)
      const errorMessage = `Camera error: ${err.name || err.message || err}`
      setError(errorMessage)
      setHasPermission(false)
      setIsCameraInitialized(false)
      onError(errorMessage)
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [scanFrame, isActive, onError])

  useEffect(() => {
    // Add small delay to handle React StrictMode
    const timeoutId = setTimeout(() => {
      if (isActive) {
        startVideoStream()
      } else {
        stopVideoStream()
      }
    }, 100)
    
    return () => {
      clearTimeout(timeoutId)
      console.log("ScannerCamera unmounting, stopping video stream.")
      stopVideoStream()
    }
  }, [isActive])

  const handleRetry = () => {
    setError(null)
    setHasPermission(null)
    startVideoStream()
  }

  if (hasPermission === false || error) {
    return (
      <Card className={cn("w-full max-w-lg mx-auto", className)}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <Camera className="h-4 w-4" />
            <AlertDescription className="mt-2">
              {error || "Camera access denied. Please allow camera permissions and try again."}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={handleRetry} 
            className="w-full mt-4"
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full max-w-lg mx-auto overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="relative">
          <video
            ref={videoRef}
            className={cn(
              "w-full h-auto transition-opacity duration-300",
              isCameraInitialized ? "opacity-100" : "opacity-0"
            )}
            playsInline
            muted
            style={{ aspectRatio: '4/3' }}
          />
          
          {!isCameraInitialized && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Initializing Camera...</p>
              </div>
            </div>
          )}
          
          {/* Scanning Frame Overlay */}
          {isCameraInitialized && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-3/4 h-3/4 max-w-80 max-h-80">
                <div className="w-full h-full border-2 border-primary/70 rounded-lg animate-pulse" />
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </CardContent>
    </Card>
  )
} 