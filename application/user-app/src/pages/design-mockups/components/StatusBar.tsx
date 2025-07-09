import React from 'react';
import { StatusBarProps } from '../types';
import './StatusBar.css';

const StatusBar: React.FC<StatusBarProps> = ({ 
  battery = '🔋 100%', 
  appName = 'ePunch', 
  signal = '📶 5G' 
}) => {
  return (
    <div className="status-bar">
      <span className="status-left">{battery}</span>
      <span className="status-center">{appName}</span>
      <span className="status-right">{signal}</span>
    </div>
  );
};

export default StatusBar; 