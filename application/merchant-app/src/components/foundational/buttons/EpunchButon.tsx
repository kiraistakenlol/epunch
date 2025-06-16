import React from 'react';
import './buttons.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const EpunchButon: React.FC<ButtonProps> = ({
  children, 
  onClick, 
  disabled = false, 
  className = '', 
  type = 'button' 
}) => {
  return (
    <button
      type={type}
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}; 