import React from 'react';
import { EpunchConfirmOrCancelButtons } from '../../../../components/foundational';
import './ScanResultCard.css';

export interface QRResultCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
  confirmDisabled?: boolean;
  cancelText?: string;
}

export const ScanResultCard: React.FC<QRResultCardProps> = ({
  title,
  subtitle,
  children,
  onCancel,
  onConfirm,
  confirmText,
  confirmDisabled = false,
  cancelText = "Reset"
}) => {
  return (
    <div className="qr-result-container">
      <div className="qr-result-content">
        <div className="qr-result-header">
          <h2 className="qr-result-title">{title}</h2>
          <p className="qr-result-subtitle">{subtitle}</p>
        </div>
        
        <div className="qr-result-body">
          {children}
        </div>
        
        <EpunchConfirmOrCancelButtons
          onCancel={onCancel}
          onConfirm={onConfirm}
          confirmText={confirmText}
          confirmDisabled={confirmDisabled}
          cancelText={cancelText}
        />
      </div>
    </div>
  );
}; 