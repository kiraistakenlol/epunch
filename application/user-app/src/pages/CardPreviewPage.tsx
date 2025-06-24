import React, { useEffect } from 'react';
import html2canvas from 'html2canvas';
import { PunchCardPreviewWrapper } from '../components/PunchCardPreviewWrapper';

const CardPreviewPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  
  // Parse all URL parameters
  const logoUrl = searchParams.get('logoUrl') || undefined;
  const renderOnBackgroundColor = searchParams.get('renderOnBackgroundColor') || 'transparent';
  
  const previewProps = {
    primaryColor: searchParams.get('primaryColor') || undefined,
    secondaryColor: searchParams.get('secondaryColor') || undefined,
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
    loyaltyProgramName: searchParams.get('loyaltyProgramName') || undefined,
    currentPunches: parseInt(searchParams.get('currentPunches') || '3'),
    totalPunches: parseInt(searchParams.get('totalPunches') || '10'),
    status: (searchParams.get('status') as any) || 'ACTIVE',
    showAnimations: searchParams.get('animations') === 'true',
    hideShadow: searchParams.get('hideShadow') === 'true',
    renderOnBackgroundColor
  };

  // PostMessage handler for taking screenshots
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'CAPTURE_CARD') {
        try {
          console.log('CardPreviewPage - Taking full viewport screenshot...');
          
          const canvas = await html2canvas(document.body, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            allowTaint: true,
          });

          const imageDataURL = canvas.toDataURL('image/png');
          
          console.log('CardPreviewPage - Screenshot captured successfully');
          
          if (event.source) {
            (event.source as Window).postMessage({
              type: 'CARD_CAPTURED',
              imageDataURL,
              width: canvas.width,
              height: canvas.height
            }, event.origin);
          }
          
        } catch (error) {
          console.error('CardPreviewPage - Error capturing screenshot:', error);
          if (event.source) {
            (event.source as Window).postMessage({
              type: 'CARD_CAPTURE_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error'
            }, event.origin);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'CARD_PREVIEW_READY' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <PunchCardPreviewWrapper {...previewProps} />
    </div>
  );
};

export default CardPreviewPage; 