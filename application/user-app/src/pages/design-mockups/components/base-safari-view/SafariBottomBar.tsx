import React from 'react';
import './SafariBottomBar.css';

interface SafariBottomBarProps {
  className?: string;
  url?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

const SafariBottomBar: React.FC<SafariBottomBarProps> = ({ 
  className = "",
  url = "epunch.app",
  canGoBack = false,
  canGoForward = false
}) => {
  return (
    <div className={`safari-bottom-bar ${className}`}>
      <div className="safari-address-section">
        <div className="safari-bottom-address-bar">
          <span className="safari-lock">🔒</span>
          <span className="safari-url">{url}</span>
        </div>
      </div>
      
      <div className="safari-nav-section">
        <button className={`safari-bottom-btn ${!canGoBack ? 'disabled' : ''}`}>◀</button>
        <button className={`safari-bottom-btn ${!canGoForward ? 'disabled' : ''}`}>▶</button>
        <button className="safari-bottom-btn">⤴</button>
        <button className="safari-bottom-btn">📖</button>
        <button className="safari-bottom-btn">⧉</button>
      </div>
    </div>
  );
};

export default SafariBottomBar; 