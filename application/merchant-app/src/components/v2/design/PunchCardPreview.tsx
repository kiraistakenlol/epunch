import React, { useState, useEffect } from 'react'
import { PunchIconsDto } from 'e-punch-common-core'
import { useAppSelector } from '../../../store/hooks'
import { punchCardPreviewService } from '../../../utils/punchCardPreviewService'

interface PunchCardPreviewProps {
  primaryColor?: string | null
  secondaryColor?: string | null  
  logoUrl?: string | null
  punchIcons?: PunchIconsDto | null
  size?: 'small' | 'medium' | 'large'
  className?: string
  style?: React.CSSProperties
  
  currentPunches?: number
  totalPunches?: number
  status?: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED'
  showAnimations?: boolean
  renderOnBackgroundColor?: string
}

export const PunchCardPreview: React.FC<PunchCardPreviewProps> = ({
  primaryColor,
  secondaryColor,
  logoUrl,
  punchIcons,
  size = 'medium',
  className,
  style,
  currentPunches = 3,
  totalPunches = 10,
  status = 'ACTIVE',
  showAnimations = false,
  renderOnBackgroundColor = 'transparent'
}) => {
  const merchant = useAppSelector(state => state.merchant.merchant)
  const [animationKey, setAnimationKey] = useState(0)

  const sizeConfig = {
    small: { maxWidth: '200px', width: '100%' },
    medium: { maxWidth: '300px', width: '100%' },
    large: { maxWidth: '400px', width: '100%' }
  }

  const buildPreviewUrl = () => {
    const url = punchCardPreviewService.getPreviewUrl({
      primaryColor,
      secondaryColor,
      logoUrl,
      punchIcons,
      merchantName: merchant?.name || 'Preview Merchant',
      currentPunches,
      totalPunches,
      status,
      showAnimations,
      hideShadow: true,
      renderOnBackgroundColor
    })

    const previewUrl = new URL(url)
    previewUrl.searchParams.set('key', animationKey.toString())
    
    return previewUrl.toString()
  }

  const triggerAnimation = () => {
    setAnimationKey(prev => prev + 1)
  }

  useEffect(() => {
    if (showAnimations) {
      triggerAnimation()
    }
  }, [showAnimations])

  return (
    <div className={className} style={style}>
      <div className="relative">
        <iframe
          key={animationKey}
          src={buildPreviewUrl()}
          className="w-full border-none block"
          style={{
            maxWidth: sizeConfig[size].maxWidth,
            aspectRatio: '1.3'
          }}
          title="Punch Card Preview"
        />
        
        {showAnimations && (
          <button
            onClick={triggerAnimation}
            className="absolute top-2 right-2 bg-black/70 text-white border-none rounded px-2 py-1 text-xs cursor-pointer z-10"
            title="Trigger Animation"
          >
            🎬
          </button>
        )}
      </div>
    </div>
  )
} 