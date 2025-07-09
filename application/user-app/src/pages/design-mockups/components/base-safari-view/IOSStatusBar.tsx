import React from 'react';
import { MdSignalCellular4Bar, MdWifi, MdBattery6Bar } from 'react-icons/md';
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
        <MdSignalCellular4Bar className="status-signal" />
        <MdWifi className="status-wifi" />
        <MdBattery6Bar className="status-battery" />
      </div>
    </div>
  );
};

export default IOSStatusBar; 