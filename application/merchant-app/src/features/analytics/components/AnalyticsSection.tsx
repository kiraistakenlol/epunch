
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from './InfoTooltip';

interface AnalyticsSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  infoTooltip?: string;
}

export function AnalyticsSection({ 
  title, 
  description, 
  icon, 
  children, 
  className,
  infoTooltip 
}: AnalyticsSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
          {infoTooltip && <InfoTooltip content={infoTooltip} />}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
} 