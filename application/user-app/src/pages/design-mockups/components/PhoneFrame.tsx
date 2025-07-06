import React from 'react';
import { PhoneFrameProps } from '../types';
import './PhoneFrame.css';

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`phone-frame ${className}`}>
      <div className="phone-screen">
        {children}
      </div>
    </div>
  );
};

export default PhoneFrame; 