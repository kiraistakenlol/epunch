import React, { useEffect } from 'react';
import html2canvas from 'html2canvas';
import { DashboardPreviewWrapper } from '../components/DashboardPreviewWrapper';

const DashboardPreviewPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  
  // Parse URL parameters
  const merchantSlug = searchParams.get('merchantSlug');
  const cardsParam = searchParams.get('cards');
  const selectedCardId = searchParams.get('selectedCardId') || undefined;
  const completionOverlayCardId = searchParams.get('completionOverlayCardId') || undefined;
  const renderOnBackgroundColor = searchParams.get('renderOnBackgroundColor') || 'white';
  
  // Parse cards JSON
  let cards;
  if (cardsParam) {
    try {
      cards = JSON.parse(cardsParam);
    } catch (error) {
      console.error('Failed to parse cards parameter:', error);
      cards = undefined;
    }
  }

  const previewProps = {
    merchantSlug,
    cards,
    selectedCardId,
    completionOverlayCardId,
    renderOnBackgroundColor
  };

  // PostMessage handler for taking screenshots
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'CAPTURE_DASHBOARD') {
        try {
          console.log('DashboardPreviewPage - Taking full viewport screenshot...');
          
          const canvas = await html2canvas(document.body, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            allowTaint: true,
          });

          const imageDataURL = canvas.toDataURL('image/png');
          
          console.log('DashboardPreviewPage - Screenshot captured successfully');
          
          if (event.source) {
            (event.source as Window).postMessage({
              type: 'DASHBOARD_CAPTURED',
              imageDataURL,
              width: canvas.width,
              height: canvas.height
            }, event.origin);
          }
          
        } catch (error) {
          console.error('DashboardPreviewPage - Error capturing screenshot:', error);
          if (event.source) {
            (event.source as Window).postMessage({
              type: 'DASHBOARD_CAPTURE_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error'
            }, event.origin);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'DASHBOARD_PREVIEW_READY' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{ 
      backgroundColor: renderOnBackgroundColor,
      minHeight: '100vh'
    }}>
      <DashboardPreviewWrapper {...previewProps} />
    </div>
  );
};

export default DashboardPreviewPage; 