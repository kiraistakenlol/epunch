import React from 'react';
import { PunchCardPreviewWrapper } from '../components/PunchCardPreviewWrapper';

const CardPreviewPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  
  // Parse all URL parameters
  const logoUrl = searchParams.get('logoUrl') || searchParams.get('logoBase64') || undefined;
  const renderOnBackgroundColor = searchParams.get('renderOnBackgroundColor') || 'transparent';
  
  const previewProps = {
    primaryColor: searchParams.get('primaryColor') || '#007bff',
    secondaryColor: searchParams.get('secondaryColor') || '#28a745',
    logoUrl,
    punchIcons: searchParams.get('punchIcons') ? (() => {
      try {
        return JSON.parse(searchParams.get('punchIcons')!);
      } catch (error) {
        console.error('Failed to parse punchIcons:', error);
        return undefined;
      }
    })() : undefined,
    merchantName: searchParams.get('merchantName') || 'Preview Merchant',
    currentPunches: parseInt(searchParams.get('currentPunches') || '3'),
    totalPunches: parseInt(searchParams.get('totalPunches') || '10'),
    status: (searchParams.get('status') as any) || 'ACTIVE',
    showAnimations: searchParams.get('animations') === 'true',
    hideShadow: searchParams.get('hideShadow') === 'true',
    renderOnBackgroundColor
  };

  // Debug logging
  console.log('CardPreviewPage - Received params:', {
    primaryColor: searchParams.get('primaryColor'),
    secondaryColor: searchParams.get('secondaryColor'),
    logoUrl: searchParams.get('logoUrl'),
    logoBase64: searchParams.get('logoBase64') ? 'base64 data present' : null,
    finalLogoUrl: logoUrl ? logoUrl.substring(0, 50) + (logoUrl.length > 50 ? '...' : '') : null,
    punchIcons: searchParams.get('punchIcons')?.substring(0, 100) + '...',
    merchantName: searchParams.get('merchantName'),
    hideShadow: searchParams.get('hideShadow'),
    renderOnBackgroundColor
  });

  return (
    <div style={{ 
      // backgroundColor: renderOnBackgroundColor,
      // minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <PunchCardPreviewWrapper {...previewProps} />
    </div>
  );
};

export default CardPreviewPage; 