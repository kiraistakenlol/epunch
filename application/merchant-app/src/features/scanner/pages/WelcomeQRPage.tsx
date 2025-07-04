import React from 'react'
import { QrCode } from 'lucide-react'
import { useAppSelector } from '../../../store/hooks'
import { PageContainer } from '@/components/shared/layout/PageContainer'
import { WelcomeBannerPreview } from '../../../components/WelcomeBannerPreview'
import { QRCodePreview } from '../../../components/QRCodePreview'

export const WelcomeQRPage: React.FC = () => {
  const { merchant } = useAppSelector((state) => state.merchant)

  return (
    <PageContainer>
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
        <QRCodePreview merchant={merchant!} />
        <WelcomeBannerPreview merchant={merchant!} />
      </div>
    </PageContainer>
  )
} 