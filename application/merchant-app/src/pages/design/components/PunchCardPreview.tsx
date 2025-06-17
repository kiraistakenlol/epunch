import React from 'react';
import SVG from 'react-inlinesvg';
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
}

export const PunchCardPreview: React.FC<PunchCardPreviewProps> = ({
  primaryColor,
  secondaryColor,
  logoUrl,
  punchIcons,
  size = 'medium',
  className,
  style
}) => {
  const merchant = useAppSelector(state => state.auth.merchant);
  const sizeConfig = {
    small: {
      maxWidth: '200px',
      headerPadding: '8px',
      headerFontSize: '11px',
      bodyPadding: '12px',
      iconSize: '16px',
      iconContainerSize: '18px',
      gap: '4px',
      logoSize: '18px',
      statusFontSize: '9px'
    },
    medium: {
      maxWidth: '240px',
      headerPadding: '10px',
      headerFontSize: '13px',
      bodyPadding: '14px',
      iconSize: '18px',
      iconContainerSize: '20px',
      gap: '5px',
      logoSize: '22px',
      statusFontSize: '10px'
    },
    large: {
      maxWidth: '300px',
      headerPadding: '14px',
      headerFontSize: '15px',
      bodyPadding: '18px',
      iconSize: '22px',
      iconContainerSize: '24px',
      gap: '6px',
      logoSize: '26px',
      statusFontSize: '11px'
    }
  };

  const config = sizeConfig[size];

  const renderIcon = (index: number) => {
    const isFilled = index < 3;

    if (punchIcons) {
      try {
        const svgContent = isFilled 
          ? punchIcons.filled.data.svg_raw_content 
          : punchIcons.unfilled.data.svg_raw_content;

        return (
          <div
            key={index}
            style={{
              width: config.iconContainerSize,
              height: config.iconContainerSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: secondaryColor
            }}
          >
            <SVG 
              src={`data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`}
              width={config.iconSize}
              height={config.iconSize}
            />
          </div>
        );
      } catch (error) {
        // Fall back to default circles if parsing fails
      }
    }
    
    // Default circle icons
    return (
      <div
        key={index}
        style={{
          width: config.iconContainerSize,
          height: config.iconContainerSize,
          borderRadius: '50%',
          backgroundColor: isFilled ? secondaryColor : 'transparent',
          border: `2px solid ${secondaryColor}`,
          fontSize: Math.floor(parseInt(config.iconSize) * 0.6) + 'px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isFilled ? 'white' : secondaryColor,
          fontWeight: 'bold'
        }}
      >
        {isFilled ? '✓' : ''}
      </div>
    );
  };

  return (
    <div 
      className={className}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: config.maxWidth,
        margin: '0 auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
        ...style
      }}
    >
      {/* Header */}
      <div style={{
        backgroundColor: primaryColor,
        color: 'white',
        padding: config.headerPadding,
        fontSize: config.headerFontSize,
        fontWeight: 'bold',
        textAlign: 'left'
      }}>
        {merchant?.name || 'Loyalty Card'}
      </div>
      
      {/* Body */}
      <div style={{ 
        padding: config.bodyPadding,
        position: 'relative'
      }}>
        {/* Punch Icons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: config.gap,
          marginBottom: '12px',
          justifyItems: 'center'
        }}>
          {[...Array(10)].map((_, i) => renderIcon(i))}
        </div>
        
        {/* Status */}
        <div style={{ 
          fontSize: config.statusFontSize, 
          color: '#999',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          11th coffee is free
        </div>
        
        {/* Logo in bottom right corner */}
        {logoUrl && (
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: config.logoSize,
            height: config.logoSize,
            borderRadius: '2px',
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={logoUrl} 
              alt="Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}; 