import React from 'react';
import './IOSStatusBar.css';

interface IOSStatusBarProps {
  time?: string;
  className?: string;
}

const IOSStatusBar: React.FC<IOSStatusBarProps> = ({ 
  time = "9:41 AM",
  className = ""
}) => {
  return (
    <div className={`ios-status-bar ${className}`}>
      <div className="status-left">
        <span className="status-time">{time}</span>
      </div>
      <div className="status-right">
        <span className="status-signal">📶</span>
        <span className="status-wifi">📡</span>
        <span className="status-battery">🔋 100%</span>
      </div>
    </div>
  );
};

export default IOSStatusBar; 