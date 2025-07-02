import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { apiClient } from 'e-punch-common-ui'
import { PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core'
import { useAppSelector } from '../../../store/hooks'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

import { LivePreview } from './LivePreview'
import { QuickActions } from './QuickActions'

import { ColorEditorModal } from './ColorEditorModal'
import { LogoEditorModal } from './LogoEditorModal'
import { IconsEditorModal } from './IconsEditorModal'
import { PreviewOptions, ModalVisibility, LoadingState } from './types'
import { getDefaultStyle } from './utils'

interface DesignEditorProps {
  className?: string
}

export const DesignEditor: React.FC<DesignEditorProps> = ({ className }) => {
  const merchant = useAppSelector(state => state.merchant.merchant)
  
  // State management
  const [currentStyle, setCurrentStyle] = useState<PunchCardStyleDto>(getDefaultStyle())
  const [updatedStyle, setUpdatedStyle] = useState<PunchCardStyleDto | null>(null)
  const [modalVisibility, setModalVisibility] = useState<ModalVisibility>({
    colors: false,
    logo: false,
    icons: false
  })
  const [loading, setLoading] = useState<LoadingState>({
    fetch: false,
    save: false
  })
  const [previewOptions, setPreviewOptions] = useState<PreviewOptions>({
    currentPunches: 3,
    totalPunches: 10,
    status: 'ACTIVE',
    showAnimations: false
  })

  // Computed values
  const displayStyle = updatedStyle || currentStyle
  const hasUnsavedChanges = updatedStyle !== null

  // Load style on component mount
  useEffect(() => {
    const fetchStyle = async () => {
      if (!merchant?.id) return
      
      setLoading(prev => ({ ...prev, fetch: true }))
      
      try {
        const fetchedStyle = await apiClient.getMerchantDefaultPunchCardStyle(merchant.id)
        setCurrentStyle(fetchedStyle)
        setUpdatedStyle(null)
      } catch (error) {
        console.error('Failed to fetch style:', error)
        toast.error('Failed to load style settings. Using defaults.')
        setCurrentStyle(getDefaultStyle())
        setUpdatedStyle(null)
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }))
      }
    }

    fetchStyle()
  }, [merchant?.id])

  // Modal handlers
  const openModal = (modal: 'colors' | 'logo' | 'icons') => {
    setModalVisibility(prev => ({ ...prev, [modal]: true }))
  }

  const closeModal = (modal: 'colors' | 'logo' | 'icons') => {
    setModalVisibility(prev => ({ ...prev, [modal]: false }))
  }

  // Style update handlers
  const handleUpdateColors = async (primaryColor: string | null, secondaryColor: string | null) => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      primaryColor,
      secondaryColor
    }))
  }

  const handleUpdateLogo = async (logoUrl: string | null) => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      logoUrl
    }))
  }

  const handleUpdateIcons = async (icons: PunchIconsDto | null) => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      punchIcons: icons
    }))
  }

  // Action handlers
  const handleApplyStyle = async () => {
    if (!merchant?.id || !updatedStyle) return
    
    setLoading(prev => ({ ...prev, save: true }))
    try {
      const styleForApi: PunchCardStyleDto = {
        primaryColor: updatedStyle.primaryColor || null,
        secondaryColor: updatedStyle.secondaryColor || null,
        logoUrl: updatedStyle.logoUrl || null,
        backgroundImageUrl: updatedStyle.backgroundImageUrl || null,
        punchIcons: updatedStyle.punchIcons || null
      }
      
      await apiClient.createOrUpdateMerchantDefaultStyle(merchant.id, styleForApi)
      
      setCurrentStyle(updatedStyle)
      setUpdatedStyle(null)
      toast.success('Style applied successfully!')
    } catch (error) {
      console.error('Failed to apply style:', error)
      toast.error('Failed to apply style')
    } finally {
      setLoading(prev => ({ ...prev, save: false }))
    }
  }

  const handleReset = () => {
    setUpdatedStyle(null)
  }

  // Loading state
  if (loading.fetch) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Live Preview Section */}
      <LivePreview
        currentStyle={currentStyle}
        updatedStyle={updatedStyle}
        previewOptions={previewOptions}
        onPreviewOptionsChange={setPreviewOptions}
        hasUnsavedChanges={hasUnsavedChanges}
        loading={loading.save}
        onReset={handleReset}
        onApplyStyle={handleApplyStyle}
      />

      {/* Design Controls Section */}
      <QuickActions
        displayStyle={displayStyle}
        onOpenModal={openModal}
      />

      {/* Modals */}
      <ColorEditorModal
        isOpen={modalVisibility.colors}
        onClose={() => closeModal('colors')}
        primaryColor={displayStyle.primaryColor}
        secondaryColor={displayStyle.secondaryColor}
        onSave={handleUpdateColors}
      />
      
      <LogoEditorModal
        isOpen={modalVisibility.logo}
        onClose={() => closeModal('logo')}
        onSave={handleUpdateLogo}
        merchantId={merchant?.id}
      />
      
      <IconsEditorModal
        isOpen={modalVisibility.icons}
        onClose={() => closeModal('icons')}
        currentIcons={displayStyle.punchIcons}
        onSave={handleUpdateIcons}
      />
    </div>
  )
} 