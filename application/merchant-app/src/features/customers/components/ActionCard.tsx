import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  onClick?: () => void;
}

export function ActionCard({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  buttonVariant = 'default',
  disabled = false,
  onClick 
}: ActionCardProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-muted">
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-1">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button 
          variant={buttonVariant}
          className="w-full" 
          disabled={disabled}
          onClick={onClick}
        >
          <Icon className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
} 