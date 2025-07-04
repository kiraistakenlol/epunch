import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  children: React.ReactElement;
  height?: number;
  className?: string;
}

export function ChartContainer({ children, height = 320, className = "" }: ChartContainerProps) {
  return (
    <div className={`w-full -mx-2 sm:mx-0 ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
} 