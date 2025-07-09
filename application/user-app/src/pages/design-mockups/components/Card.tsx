import React from 'react';
import { CardProps } from '../types';
import './Card.css';

const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  onClick
}) => {
  return (
    <div 
      className={`card card--${variant} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
};

export default Card; 