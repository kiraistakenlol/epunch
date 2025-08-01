import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SectionHeader } from './SectionHeader';
import { EmptyState } from './EmptyState';

interface ManagementSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  count: number;
  emptyStateTitle: string;
  emptyStateDescription: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}

export function ManagementSection({
  icon,
  title,
  description,
  count,
  emptyStateTitle,
  emptyStateDescription,
  children,
  actions
}: ManagementSectionProps) {
  const isEmpty = count === 0;

  return (
    <Card>
      <CardContent className="p-6">
        <SectionHeader
          icon={icon}
          title={title}
          description={description}
          count={count}
        />
        
        <div className="mt-6 space-y-6">
          {/* Current Items */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              Current {title}
            </h4>
            {isEmpty ? (
              <EmptyState
                icon={icon}
                title={emptyStateTitle}
                description={emptyStateDescription}
              />
            ) : (
              children
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Actions</h4>
            {actions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 