import React from 'react';

interface PhoneWithUserAppProps {
  src: string;
  className?: string;
  loading?: string;
}

export const PhoneWithUserApp: React.FC<PhoneWithUserAppProps> = ({ src, className }) => {
  const phoneFrameStyle: React.CSSProperties = {
    width: '280px',
    height: '560px',
    background: '#1f1f1f',
    borderRadius: '24px',
    padding: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    position: 'relative',
  };

  const phoneScreenStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
  };

  const notchStyle: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '4px',
    background: '#333',
    borderRadius: '2px',
  };

  return (
    <div className={className} style={phoneFrameStyle}>
      <div style={notchStyle} />
      <div style={phoneScreenStyle}>
        <iframe
          src={src}
          width="100%"
          height="100%"
          frameBorder="0"
          title="User App Preview"
          style={{
            borderRadius: '12px',
            background: 'white'
          }}
        />
      </div>
    </div>
  );
}; 