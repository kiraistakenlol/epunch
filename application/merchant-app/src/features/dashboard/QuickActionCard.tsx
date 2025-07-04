import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface QuickActionCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  secondaryAction?: {
    icon: ReactNode;
    onClick: (e: React.MouseEvent) => void;
  };
}

export function QuickActionCard({ 
  icon, 
  title, 
  description, 
  onClick, 
  secondaryAction 
}: QuickActionCardProps) {
  return (
    <div className="group relative">
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-gray-300/60 h-40 sm:h-44"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative p-6 sm:p-8 h-full flex flex-col justify-center">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:text-primary/80 transition-colors duration-300">
              {icon}
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 group-hover:text-primary transition-colors duration-200">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-600 max-w-32 sm:max-w-none">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {secondaryAction && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
          onClick={secondaryAction.onClick}
        >
          <div className="w-4 h-4 text-gray-600">
            {secondaryAction.icon}
          </div>
        </Button>
      )}
    </div>
  );
} 