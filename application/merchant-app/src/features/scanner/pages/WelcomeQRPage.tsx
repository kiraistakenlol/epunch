import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, RefreshCw, QrCode } from 'lucide-react'
import { useAppSelector } from '../../../store/hooks'
import { generateOnboardingImage, downloadImage } from '../../../services/imageUtils'
import { toast } from 'sonner'
import { ColorPicker } from '../../design/components/ColorPicker'
import QRCodeLib from 'qrcode'
import { Section } from '../components/Section'
import { DownloadButton } from '../components/DownloadButton'

export const WelcomeQRPage: React.FC = () => {
  const { merchant, loading: merchantLoading, error: merchantError } = useAppSelector((state) => state.merchant)
  
  // Welcome Banner states
  const [onboardingImageUrl, setOnboardingImageUrl] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [loyaltyProgramName, setLoyaltyProgramName] = useState<string>('')
  const [titleColor, setTitleColor] = useState<string>('#FFFFFF')
  const [title, setTitle] = useState<string>('')
  const [backgroundColor, setBackgroundColor] = useState<string>('#FF6D00')
  const [qrCodeBackgroundColor, setQrCodeBackgroundColor] = useState<string>('#FFFFFF')
  
  // QR Code Only states
  const [standaloneQRUrl, setStandaloneQRUrl] = useState<string | null>(null)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

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
  }, [merchant, title])

  useEffect(() => {
    if (!merchant || !title) return
    
    const timeoutId = setTimeout(() => {
      generateOnboardingImagePreview()
    }, 800)

    return () => clearTimeout(timeoutId)
  }, [backgroundColor, qrCodeBackgroundColor, titleColor, loyaltyProgramName])

  useEffect(() => {
    if (merchant) {
      generateStandaloneQR()
    }
  }, [merchant])

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



  if (merchantLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading merchant data...</p>
        </div>
      </div>
    )
  }

  if (merchantError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-full max-w-md text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">
            Error loading merchant data: {merchantError}
          </p>
        </div>
      </div>
    )
  }

  if (!merchant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-full max-w-md text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">No Data</h2>
          <p className="text-gray-600">
            Unable to load merchant data
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <QrCode className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">QR Code Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Generate QR codes for your merchant that customers can scan to access your loyalty programs
        </p>
      </div>

            <div className="space-y-12">
        {/* QR Code Section */}
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

                {/* Welcome Banner Section */}
        <Section
          title="Welcome Banner"
          description="Customizable welcome banner with your QR code and branding"
          icon={<RefreshCw className="h-6 w-6 text-gray-600" />}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Banner Controls */}
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

            {/* Banner Preview */}
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
       </div>
     </div>
   )
 } 