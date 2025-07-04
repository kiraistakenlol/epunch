import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, RefreshCw, QrCode } from 'lucide-react'
import { generateOnboardingImage, downloadImage } from '../services/imageUtils'
import { toast } from 'sonner'
import { ColorPicker } from '../features/design/components/ColorPicker'
import { Section } from '../features/scanner/components/Section'
import { DownloadButton } from '../features/scanner/components/DownloadButton'
import { MerchantDto } from 'e-punch-common-core'

interface WelcomeBannerPreviewProps {
  merchant: MerchantDto
}

export const WelcomeBannerPreview: React.FC<WelcomeBannerPreviewProps> = ({ merchant }) => {
  const [onboardingImageUrl, setOnboardingImageUrl] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [loyaltyProgramName, setLoyaltyProgramName] = useState<string>('')
  const [titleColor, setTitleColor] = useState<string>('#FFFFFF')
  const [title, setTitle] = useState<string>('')
  const [backgroundColor, setBackgroundColor] = useState<string>('#c4c2c0')
  const [qrCodeBackgroundColor, setQrCodeBackgroundColor] = useState<string>('#FFFFFF')

  useEffect(() => {
    if (merchant && !title) {
      setTitle(merchant.name)
      if (!loyaltyProgramName) {
        setLoyaltyProgramName(`${merchant.name} Rewards`)
      }
    }
  }, [merchant, title, loyaltyProgramName])

  useEffect(() => {
    if (merchant && !onboardingImageUrl && !isGeneratingImage && title) {
      generateOnboardingImagePreview()
    }
  }, [merchant, title, loyaltyProgramName])

  useEffect(() => {
    if (!merchant || !title) return
    
    const timeoutId = setTimeout(() => {
      generateOnboardingImagePreview()
    }, 800)

    return () => clearTimeout(timeoutId)
  }, [backgroundColor, qrCodeBackgroundColor, titleColor, loyaltyProgramName, title])

  const generateOnboardingImagePreview = async () => {
    if (!merchant || !title) return

    try {
      setIsGeneratingImage(true)
      const imageDataUrl = await generateOnboardingImage(
        merchant,
        backgroundColor,
        qrCodeBackgroundColor,
        titleColor,
        title,
        loyaltyProgramName
      )
      setOnboardingImageUrl(imageDataUrl)
    } catch (error: any) {
      console.error('Failed to generate onboarding image:', error)
      toast.error("Error", {
        description: "Failed to generate image preview",
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleDownloadImage = async () => {
    if (!merchant || !onboardingImageUrl) return

    try {
      const filename = `${merchant.name.replace(/[^a-zA-Z0-9]/g, '_')}_Welcome_Banner.png`
      downloadImage(onboardingImageUrl, filename)
      toast.success("Success", {
        description: "Welcome banner downloaded successfully!",
      })
    } catch (error: any) {
      console.error('Failed to download image:', error)
      toast.error("Error", {
        description: "Failed to download image",
      })
    }
  }

  return (
    <Section
      title="Welcome Banner"
      description="Customizable welcome banner with your QR code and branding"
      icon={<RefreshCw className="h-6 w-6 text-gray-600" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Your business name or title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loyaltyProgram">Loyalty Program Name</Label>
            <Input
              id="loyaltyProgram"
              placeholder="e.g., Coffee Rewards, VIP Program"
              value={loyaltyProgramName}
              onChange={(e) => setLoyaltyProgramName(e.target.value)}
            />
          </div>

          <ColorPicker
            label="Background Color"
            value={backgroundColor}
            onChange={setBackgroundColor}
          />

          <ColorPicker
            label="QR Code Background Color"
            value={qrCodeBackgroundColor}
            onChange={setQrCodeBackgroundColor}
          />

          <ColorPicker
            label="Title Color"
            value={titleColor}
            onChange={setTitleColor}
          />
        </div>

        <div>
          {isGeneratingImage ? (
            <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Generating your welcome banner...
              </p>
            </div>
          ) : onboardingImageUrl ? (
            <div className="rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={onboardingImageUrl}
                alt="Welcome Banner Preview"
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
              <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-center">
                Preview will appear here
                <br />
                <span className="text-sm">Adjust settings and click "Apply Changes"</span>
              </p>
            </div>
          )}
        </div>
      </div>
       
      <DownloadButton
        onClick={handleDownloadImage}
        disabled={!onboardingImageUrl}
      >
        Download Banner
      </DownloadButton>
    </Section>
  )
} 