import React from 'react';

interface WelcomeBannerLayoutProps {
  title: string;
  titleColor: string;
  backgroundColor: string;
  qrCodeBackgroundColor: string;
  qrCodeDataURL: string;
  cardImageDataUrl?: string;
  cardPreviewUrl?: string;
  merchantName: string;
  loyaltyProgramName?: string;
  containerWidth?: string;
  containerHeight?: string;
  isPreview?: boolean;
}

export const WelcomeBannerLayout: React.FC<WelcomeBannerLayoutProps> = ({
  title,
  titleColor,
  backgroundColor,
  qrCodeBackgroundColor,
  qrCodeDataURL,
  cardImageDataUrl,
  cardPreviewUrl,
  merchantName,
  loyaltyProgramName,
  containerWidth = '800px',
  containerHeight = '600px',
  isPreview = false
}) => {
  const containerStyle: React.CSSProperties = {
    width: containerWidth,
    height: containerHeight,
    backgroundColor,
    padding: isPreview ? '20px' : '40px',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box'
  };

  const mainContentStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: backgroundColor,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: isPreview ? '15px' : '30px',
    boxSizing: 'border-box'
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: titleColor,
    margin: 0,
    fontSize: isPreview ? '2rem' : '4rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  const contentRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isPreview ? '20px' : '40px',
    flexWrap: 'wrap'
  };

  const qrCodeContainerStyle: React.CSSProperties = {
    backgroundColor: qrCodeBackgroundColor,
    border: `12px solid ${qrCodeBackgroundColor}`,
    borderRadius: 0,
    width: isPreview ? '150px' : '230px',
    height: isPreview ? '150px' : '230px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const qrCodeImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%'
  };

  const arrowStyle: React.CSSProperties = {
    color: titleColor,
    fontWeight: '900',
    fontSize: isPreview ? '40px' : '68px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const cardContainerStyle: React.CSSProperties = {
    width: isPreview ? '100%' : '350px',
    height: isPreview ? '200px' : '280px',
    maxWidth: '350px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
  };

  const cardImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  };

  const fallbackCardStyle: React.CSSProperties = {
    width: '280px',
    height: '180px',
    backgroundColor: '#8d6e63',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(93, 64, 55, 0.3)'
  };

  const fallbackCardHeaderStyle: React.CSSProperties = {
    backgroundColor: '#5d4037',
    color: titleColor,
    padding: '12px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const fallbackCardBodyStyle: React.CSSProperties = {
    padding: '15px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  };

  const punchGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '6px',
    width: '100%',
    justifyItems: 'center'
  };

  const punchDotStyle = (isFilled: boolean): React.CSSProperties => ({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: isFilled ? '#3e2723' : 'rgba(250, 250, 232, 0.78)',
    border: '2px solid #5d4037',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const fallbackCardTextStyle: React.CSSProperties = {
    color: titleColor,
    fontSize: '0.9rem',
    fontWeight: '500',
    textAlign: 'center'
  };

  const renderCard = () => {
    if (cardImageDataUrl) {
      return (
        <div style={cardContainerStyle}>
          <img 
            src={cardImageDataUrl} 
            style={cardImageStyle}
            alt="Punch Card Preview" 
          />
        </div>
      );
    }

    if (isPreview && cardPreviewUrl) {
      return (
        <div style={cardContainerStyle}>
          <iframe
            src={cardPreviewUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: 'transparent'
            }}
            title="Punch Card Preview"
          />
        </div>
      );
    }

    return (
      <div style={fallbackCardStyle}>
        <div style={fallbackCardHeaderStyle}>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            {merchantName}
          </span>
        </div>
        <div style={fallbackCardBodyStyle}>
          <div style={punchGridStyle}>
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                style={punchDotStyle(index < 3)}
              />
            ))}
          </div>
          <div style={fallbackCardTextStyle}>
            {loyaltyProgramName || 'Buy 10, Get 1 Free'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={mainContentStyle}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={titleStyle}>{title}</h1>
        </div>
        
        <div style={contentRowStyle}>
          <div style={qrCodeContainerStyle}>
            <img 
              src={qrCodeDataURL} 
              style={qrCodeImageStyle}
              alt="QR Code" 
            />
          </div>
          
          <div style={arrowStyle}>→</div>
          
          {renderCard()}
        </div>
      </div>
    </div>
  );
}; 