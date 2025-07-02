import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MerchantScannerPageMockupProps {
  children?: React.ReactNode;
  className?: string;
  frameSize?: number;
  frameOffsetX?: number;
  frameOffsetY?: number;
}

export const MerchantScannerPageMockup: React.FC<MerchantScannerPageMockupProps> = ({
  children,
  className,
  frameSize = 200,
  frameOffsetX = 0,
  frameOffsetY = 0
}) => {
  return (
    <Card className={cn("w-full h-full bg-background border-2 overflow-hidden", className)}>
      {/* Scanner header */}
      <div className="bg-primary text-primary-foreground p-2 text-center">
        <span className="text-sm font-medium">Scanner</span>
      </div>
      
      {/* Scanner viewfinder area */}
      <div className="relative flex-1 bg-muted/20 p-4 h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground text-sm mb-4 absolute top-4 left-0 right-0">
          Scan customer QR code
        </div>
        
        {/* Scanning frame */}
        <div 
          className="relative border-2 border-primary bg-transparent"
          style={{
            width: `${frameSize}px`,
            height: `${frameSize}px`,
            transform: `translate(${frameOffsetX}px, ${frameOffsetY}px)`
          }}
        >
          {/* Corner indicators */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-primary" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-primary" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-primary" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-primary" />
          
          {/* Content inside frame */}
          {children && (
            <div className="absolute inset-0 flex items-center justify-center">
              {children}
            </div>
          )}
        </div>
        
        {/* Scanner instructions */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-muted-foreground text-xs">
          Hold steady for best results
        </div>
      </div>
    </Card>
  );
}; 