import React from 'react';
import { ProgressBarProps } from '../types';
import './ProgressBar.css';

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  className = '' 
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className={`progress-container ${className}`}>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="progress-text">
        {current}/{total}
      </div>
    </div>
  );
};

export default ProgressBar; 