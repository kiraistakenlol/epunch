import React, { useState, useEffect } from 'react';
import { PunchIconsDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../store/hooks';
import { colors } from '../../../theme/constants';
import { punchCardPreviewService } from '../../../utils/punchCardPreviewService';

interface PunchCardPreviewProps {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string | null;
  punchIcons?: PunchIconsDto | null;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
  
  // New preview options
  currentPunches?: number;
  totalPunches?: number;
  status?: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';
  showAnimations?: boolean;
  renderOnBackgroundColor?: string;
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
  renderOnBackgroundColor = colors.background.paper
}) => {
  const merchant = useAppSelector(state => state.merchant.merchant);
  const [animationKey, setAnimationKey] = useState(0);

  // Size configuration with responsive widths
  const sizeConfig = {
    small: { maxWidth: '200px', width: '100%' },
    medium: { maxWidth: '300px', width: '100%' },
    large: { maxWidth: '400px', width: '100%' }
  };

  // Build iframe URL with all styling parameters
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
    });
    
    // Add animation key for force refresh
    const previewUrl = new URL(url);
    previewUrl.searchParams.set('key', animationKey.toString());
    
    return previewUrl.toString();
  };

  // Trigger animation by refreshing iframe
  const triggerAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };

  // Auto-trigger animation when showAnimations changes to true
  useEffect(() => {
    if (showAnimations) {
      triggerAnimation();
    }
  }, [showAnimations]);

  return (
    <div className={className} style={style}>
      <div style={{ position: 'relative' }}>
        <iframe
          key={animationKey} // Force re-render for animations
          src={buildPreviewUrl()}
          style={{
            width: sizeConfig[size].width,
            maxWidth: sizeConfig[size].maxWidth,
            aspectRatio: '1.3',
            border: 'none',
            display: 'block'
          }}
          title="Punch Card Preview"
        />
        
        {/* Animation trigger button (only show when animations are enabled) */}
        {showAnimations && (
          <button
            onClick={triggerAnimation}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
              zIndex: 10
            }}
            title="Trigger Animation"
          >
            🎬
          </button>
        )}
      </div>
    </div>
  );
}; 