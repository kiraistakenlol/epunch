import React from 'react';
import { ButtonProps } from '../types';
import './Button.css';

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '' 
}) => {
  return (
    <button 
      className={`btn btn--${variant} btn--${size} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button; 