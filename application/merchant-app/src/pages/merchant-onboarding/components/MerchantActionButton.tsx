import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MerchantActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'destructive';
  className?: string;
}

export const MerchantActionButton: React.FC<MerchantActionButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  className
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size="lg"
      className={cn(
        "w-full mt-4 font-semibold",
        variant === 'default' && "bg-primary hover:bg-primary/90",
        className
      )}
    >
      {children}
    </Button>
  );
}; 