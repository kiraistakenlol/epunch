import React from 'react';
import { QrCode, Circle } from 'lucide-react';
import './FloatingQRButton.css';

interface FloatingQRButtonProps {
  onClick: () => void;
  hasRewards?: boolean;
}

const FloatingQRButton: React.FC<FloatingQRButtonProps> = ({ onClick, hasRewards = false }) => {
  return (
    <button 
      className={`floating-qr-button ${hasRewards ? 'has-rewards' : ''}`}
      onClick={onClick}
      aria-label="Show QR Code"
    >
      <QrCode size={20} strokeWidth={2} />
      {hasRewards && (
        <div className="reward-indicator">
          <Circle size={8} fill="currentColor" />
        </div>
      )}
    </button>
  );
};

export default FloatingQRButton; 