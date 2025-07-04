import { Info } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  content: string;
  maxWidth?: string;
}

export function InfoTooltip({ content, maxWidth = "300px" }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-[300px] p-3 text-sm leading-relaxed"
          style={{ maxWidth }}
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 