import React from 'react';
import { EpunchButon } from './EpunchButon.tsx';

interface SuccessButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const EpunchSuccessButton: React.FC<SuccessButtonProps> = ({
  children, 
  onClick, 
  disabled = false 
}) => {
  return (
    <EpunchButon
      className="btn-success"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </EpunchButon>
  );
}; 