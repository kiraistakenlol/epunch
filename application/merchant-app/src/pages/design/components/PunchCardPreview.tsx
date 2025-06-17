import React, { useState, useEffect } from 'react';
import { PunchIconsDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../store/hooks';

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
  showAnimations = false
}) => {
  const merchant = useAppSelector(state => state.auth.merchant);
  const [animationKey, setAnimationKey] = useState(0);

  // Size configuration for iframe dimensions
  const sizeConfig = {
    small: { width: '240px', height: '160px' },
    medium: { width: '320px', height: '220px' },
    large: { width: '400px', height: '280px' }
  };

  // Build iframe URL with all styling parameters
  const buildPreviewUrl = () => {
    const baseUrl = process.env.VITE_USER_APP_URL || 'http://localhost:5173';
    const previewUrl = new URL(`${baseUrl}/merchant/card-preview`);
    
    // Don't double-encode - URL.searchParams.set() handles encoding automatically
    previewUrl.searchParams.set('primaryColor', primaryColor);
    previewUrl.searchParams.set('secondaryColor', secondaryColor);
    previewUrl.searchParams.set('merchantName', merchant?.name || 'Preview Merchant');
    previewUrl.searchParams.set('currentPunches', currentPunches.toString());
    previewUrl.searchParams.set('totalPunches', totalPunches.toString());
    previewUrl.searchParams.set('status', status);
    previewUrl.searchParams.set('animations', showAnimations.toString());
    previewUrl.searchParams.set('key', animationKey.toString()); // Force iframe refresh for animations
    
    // Handle logo URL - could be regular URL or base64 data URL
    if (logoUrl) {
      if (logoUrl.startsWith('data:')) {
        // It's a base64 data URL, encode it for URL transmission
        previewUrl.searchParams.set('logoBase64', logoUrl);
      } else {
        // It's a regular URL
        previewUrl.searchParams.set('logoUrl', logoUrl);
      }
    }
    if (punchIcons) previewUrl.searchParams.set('punchIcons', JSON.stringify(punchIcons));

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
          width={sizeConfig[size].width}
          height={sizeConfig[size].height}
          style={{
            border: 'none',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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