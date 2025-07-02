import React from 'react'
import { ScannerInterface } from '@/features/scanner/components/ScannerInterface'
import { PageContainer } from '@/components/shared/layout/PageContainer'

export const V2ScannerPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">QR Code Scanner</h1>
        </div>

        <ScannerInterface className="mt-6" />
      </div>
    </PageContainer>
  )
} 