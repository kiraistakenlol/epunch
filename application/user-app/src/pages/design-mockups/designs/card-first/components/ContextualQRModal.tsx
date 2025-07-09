import React from 'react';
import { Button } from '../../../components';
import './ContextualQRModal.css';

interface ContextualQRModalProps {
  onClose: () => void;
  mode: 'user' | 'reward';
  shopName?: string;
}

const ContextualQRModal: React.FC<ContextualQRModalProps> = ({ 
  onClose, 
  mode, 
  shopName 
}) => {
  const qrCodeText = mode === 'reward' 
    ? `REWARD_${shopName?.toUpperCase()}_${Date.now()}`
    : `USER_${Date.now()}`;

  return (
    <div className="contextual-qr-modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            {mode === 'reward' ? `Claim from ${shopName}` : 'Your QR Code'}
          </h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="qr-code-section">
          <div className="qr-code-placeholder">
            <div className="qr-pattern">
              <div className="qr-corner"></div>
              <div className="qr-corner"></div>
              <div className="qr-corner"></div>
              <div className="qr-corner"></div>
              <div className="qr-dots">
                {Array.from({ length: 64 }, (_, i) => (
                  <div key={i} className="qr-dot"></div>
                ))}
              </div>
            </div>
          </div>
          
          <p className="qr-instruction">
            {mode === 'reward' 
              ? 'Show this code to claim your reward'
              : 'Show this code to earn punches'
            }
          </p>
          
          <div className="qr-code-text">
            <small>{qrCodeText}</small>
          </div>
        </div>

        <div className="modal-actions">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContextualQRModal; 