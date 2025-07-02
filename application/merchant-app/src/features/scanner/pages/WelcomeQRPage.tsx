import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Download, RefreshCw, QrCode } from 'lucide-react'
import { useAppSelector } from '../../../store/hooks'
import { generateOnboardingImage, downloadImage } from '../../../services/imageUtils'
import { toast } from 'sonner'
import { ColorPicker } from '../../design/components/ColorPicker'

export const WelcomeQRPage: React.FC = () => {
  const { merchant, loading: merchantLoading, error: merchantError } = useAppSelector((state) => state.merchant)
  const [onboardingImageUrl, setOnboardingImageUrl] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [loyaltyProgramName, setLoyaltyProgramName] = useState<string>('')
  const [titleColor, setTitleColor] = useState<string>('#FFFFFF')
  const [title, setTitle] = useState<string>('')
  const [backgroundColor, setBackgroundColor] = useState<string>('#FF6D00')
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
  }, [merchant, title])

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
      const filename = `${merchant.name.replace(/[^a-zA-Z0-9]/g, '_')}_Welcome_QR.png`
      downloadImage(onboardingImageUrl, filename)
      toast.success("Success", {
        description: "Image downloaded successfully!",
      })
    } catch (error: any) {
      console.error('Failed to download image:', error)
      toast.error("Error", {
        description: "Failed to download image",
      })
    }
  }

  const handleRegenerateImage = () => {
    setOnboardingImageUrl(null)
    if (merchant) {
      generateOnboardingImagePreview()
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
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Error loading merchant data: {merchantError}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!merchant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">No Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load merchant data
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <QrCode className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Welcome QR Code</h1>
        </div>
        <p className="text-muted-foreground">
          Create a welcome QR code image for your merchant that customers can scan to access your loyalty programs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Section */}
        <Card>
          <CardHeader>
            <CardTitle>Customize Your QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <Button
              onClick={handleRegenerateImage}
              disabled={isGeneratingImage}
              className="w-full"
              size="lg"
            >
              {isGeneratingImage ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Apply Changes
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {isGeneratingImage ? (
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  Generating your QR code...
                </p>
              </div>
            ) : onboardingImageUrl ? (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden border-2 border-muted">
                  <img
                    src={onboardingImageUrl}
                    alt="QR Code Image Preview"
                    className="w-full h-auto"
                  />
                </div>

                <Button
                  onClick={handleDownloadImage}
                  disabled={!onboardingImageUrl}
                  className="w-full"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-center">
                  Preview will appear here
                  <br />
                  <span className="text-sm">Adjust settings and click "Apply Changes"</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 