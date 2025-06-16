import React from 'react';
import { EpunchButon } from './EpunchButon.tsx';

interface ErrorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const EpunchErrorButton: React.FC<ErrorButtonProps> = ({
  children, 
  onClick, 
  disabled = false 
}) => {
  return (
    <EpunchButon
      className="btn-error"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </EpunchButon>
  );
}; 