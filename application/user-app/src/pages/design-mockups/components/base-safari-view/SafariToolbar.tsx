import React from 'react';
import './SafariToolbar.css';

interface SafariToolbarProps {
  className?: string;
}

const SafariToolbar: React.FC<SafariToolbarProps> = ({ 
  className = ""
}) => {
  return (
    <div className={`safari-chrome ${className}`}>
    </div>
  );
};

export default SafariToolbar; 