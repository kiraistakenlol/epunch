import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ItemCardProps {
  icon: LucideIcon;
  iconColor?: string;
  borderColor?: string;
  title: string;
  description?: string;
  statusBadge: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  progress?: {
    value: number;
    label: string;
  };
  metadata: Array<{
    icon: LucideIcon;
    text: string;
    className?: string;
  }>;
  actions?: React.ReactNode;
}

export function ItemCard({
  icon: Icon,
  iconColor = 'text-primary',
  borderColor = 'border-l-primary/20',
  title,
  description,
  statusBadge,
  progress,
  metadata,
  actions
}: ItemCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
            <span className="text-sm font-medium truncate">{title}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={statusBadge.variant} className="text-xs">
              {statusBadge.text}
            </Badge>
            {actions}
          </div>
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground mb-3">{description}</p>
        )}
        
        {progress && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{progress.label}</span>
              <span className="font-medium">{progress.value}%</span>
            </div>
            <Progress value={progress.value} className="h-1.5" />
          </div>
        )}
        
        <div className="text-xs text-muted-foreground space-y-1">
          {metadata.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <item.icon className="w-3 h-3" />
              <span className={item.className}>{item.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 