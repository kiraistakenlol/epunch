import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  frameSize = 60,
  frameOffsetX = 0,
  frameOffsetY = 0
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3 p-2 h-full", className)}>
      <Card className="w-full max-w-[280px] overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="relative bg-muted" style={{ aspectRatio: '4/3' }}>
            {/* Camera background simulation */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800"></div>
            
            {/* Children positioned in the middle of CardContent */}
            {children && (
              <div className="absolute inset-0 flex items-center justify-center">
                {children}
              </div>
            )}
            
            {/* Scanning Frame Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="relative border-2 border-primary/70 rounded-lg animate-pulse"
                style={{
                  width: `${frameSize}px`,
                  height: `${frameSize}px`,
                  transform: `translate(${frameOffsetX}px, ${frameOffsetY}px)`
                }}
              >
                {/* Corner indicators */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-muted-foreground max-w-[260px]">
        <p>Position QR code within the frame</p>
      </div>
    </div>
  );
}; 