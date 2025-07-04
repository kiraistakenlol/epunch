import React, { useState, useEffect } from 'react'
import { Loader2, QrCode } from 'lucide-react'
import { downloadImage } from '../services/imageUtils'
import { toast } from 'sonner'
import QRCodeLib from 'qrcode'
import { Section } from '../features/scanner/components/Section'
import { DownloadButton } from '../features/scanner/components/DownloadButton'
import { MerchantDto } from 'e-punch-common-core'

interface QRCodePreviewProps {
  merchant: MerchantDto
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({ merchant }) => {
  const [standaloneQRUrl, setStandaloneQRUrl] = useState<string | null>(null)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

  useEffect(() => {
    if (merchant) {
      generateStandaloneQR()
    }
  }, [merchant])

  const generateStandaloneQR = async () => {
    if (!merchant) return

    try {
      setIsGeneratingQR(true)
      const baseUrl = import.meta.env.VITE_USER_APP_URL || 'https://epunch.app'
      const qrCodeUrl = `${baseUrl}?merchant=${merchant.slug}`
      
      const qrCodeDataUrl = await QRCodeLib.toDataURL(qrCodeUrl, {
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      setStandaloneQRUrl(qrCodeDataUrl)
    } catch (error: any) {
      console.error('Failed to generate QR code:', error)
      toast.error("Error", {
        description: "Failed to generate QR code",
      })
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const handleDownloadQR = async () => {
    if (!merchant || !standaloneQRUrl) return

    try {
      const filename = `${merchant.name.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Code.png`
      downloadImage(standaloneQRUrl, filename)
      toast.success("Success", {
        description: "QR code downloaded successfully!",
      })
    } catch (error: any) {
      console.error('Failed to download QR code:', error)
      toast.error("Error", {
        description: "Failed to download QR code",
      })
    }
  }

  return (
    <Section
      title="QR Code"
      description="Simple QR code that customers can scan to access your loyalty programs"
      icon={<QrCode className="h-6 w-6 text-gray-600" />}
    >
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          {isGeneratingQR ? (
            <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Generating QR code...
              </p>
            </div>
          ) : standaloneQRUrl ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                  <img
                    src={standaloneQRUrl}
                    alt="QR Code"
                    className="w-56 h-56 object-cover"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
              <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-center">
                QR code will appear here
              </p>
            </div>
          )}
        </div>
      </div>
      
      <DownloadButton
        onClick={handleDownloadQR}
        disabled={!standaloneQRUrl}
      >
        Download QR Code
      </DownloadButton>
    </Section>
  )
} 