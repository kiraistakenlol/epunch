import React from 'react';
import { EpunchErrorButton } from './EpunchErrorButton.tsx';
import { EpunchSuccessButton } from './EpunchSuccessButton.tsx';
import './buttons.css';

interface ConfirmOrCancelButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText: string;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
}

export const EpunchConfirmOrCancelButtons: React.FC<ConfirmOrCancelButtonsProps> = ({
  onCancel,
  onConfirm,
  cancelText = "Reset",
  confirmText,
  confirmDisabled = false,
  cancelDisabled = false
}) => {
  return (
    <div className="action-buttons-container">
      <EpunchErrorButton onClick={onCancel} disabled={cancelDisabled}>
        {cancelText}
      </EpunchErrorButton>
      <EpunchSuccessButton onClick={onConfirm} disabled={confirmDisabled}>
        {confirmText}
      </EpunchSuccessButton>
    </div>
  );
}; 