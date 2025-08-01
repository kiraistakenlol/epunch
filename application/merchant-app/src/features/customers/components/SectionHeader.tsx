import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  count?: number;
}

export function SectionHeader({ icon: Icon, title, description, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {typeof count === 'number' && (
              <Badge variant="secondary" className="text-xs">
                {count}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
} 