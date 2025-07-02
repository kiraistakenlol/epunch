import React from 'react';
import { cn } from '@/lib/cn';

interface ScanningFrameProps {
  children?: React.ReactNode;
  offsetX?: number;
  offsetY?: number;
  size?: number;
  className?: string;
}

export const ScanningFrame: React.FC<ScanningFrameProps> = ({
  children,
  offsetX = 0,
  offsetY = 0,
  size = 200,
  className
}) => {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <div 
        className="absolute border-2 border-primary bg-transparent z-10"
        style={{
          left: `calc(50% - ${size / 2}px + ${offsetX}px)`,
          top: `calc(50% - ${size / 2}px + ${offsetY}px)`,
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {/* Animated corner indicators */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-primary" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-primary" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-primary" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-primary" />
        
        {/* Scanning animation line */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-primary opacity-75 animate-pulse" />
        
        {children && (
          <div className="absolute inset-0 flex items-center justify-center">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}; 