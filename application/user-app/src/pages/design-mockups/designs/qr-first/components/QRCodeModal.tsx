import React from 'react';
import { Button } from '../../../components';
import './QRCodeModal.css';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'user' | 'reward';
  hasRewards?: boolean;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ 
  isOpen, 
  onClose, 
  mode = 'user',
  hasRewards = false 
}) => {
  if (!isOpen) return null;

  const qrCodeData = mode === 'reward' ? 'REWARD_CODE_12345' : 'USER_ID_67890';
  const title = mode === 'reward' ? 'Redeem Reward' : 'Scan for Punch';
  const subtitle = mode === 'reward' 
    ? 'Show this QR code to redeem your reward'
    : 'Show this QR code to get your punch';

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="qr-modal-body">
          <p className="qr-subtitle">{subtitle}</p>
          
          <div className="qr-code-container">
            <div className="qr-code-placeholder">
              <div className="qr-grid">
                {Array.from({ length: 121 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`qr-dot ${Math.random() > 0.6 ? 'filled' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="qr-code-text">{qrCodeData}</div>
          
          {hasRewards && mode === 'user' && (
            <div className="reward-notice">
              <span className="reward-icon">🎁</span>
              You have rewards ready to claim!
            </div>
          )}
        </div>
        
        <div className="qr-modal-footer">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {hasRewards && mode === 'user' && (
            <Button variant="success" onClick={() => {}}>
              Switch to Reward QR
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal; 