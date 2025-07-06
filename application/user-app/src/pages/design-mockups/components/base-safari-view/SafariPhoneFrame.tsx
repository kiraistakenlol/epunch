import React from 'react';
import IOSStatusBar from './IOSStatusBar';
import SafariToolbar from './SafariToolbar';
import SafariBottomBar from './SafariBottomBar';
import './SafariPhoneFrame.css';

interface SafariPhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  url?: string;
  time?: string;
}

const SafariPhoneFrame: React.FC<SafariPhoneFrameProps> = ({ 
  children, 
  className = '',
  url = "epunch.app",
  time = "9:41 AM"
}) => {
  return (
    <div className={`safari-phone-frame ${className}`}>
      <IOSStatusBar time={time} />
      <SafariToolbar />
      
      <div className="phone-content">
        {children}
      </div>

      <SafariBottomBar url={url} />
    </div>
  );
};

export default SafariPhoneFrame; 