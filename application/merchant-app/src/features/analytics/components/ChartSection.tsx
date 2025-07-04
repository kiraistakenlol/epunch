import { AnalyticsSection } from './AnalyticsSection';
import { ProgramSelector } from './ProgramSelector';
import { TimeUnitSelector, TimeUnit } from './TimeUnitSelector';

interface ProgramOption {
  id: string;
  name: string;
}

interface ChartSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  infoTooltip: string;
  children: React.ReactNode;
  
  // Optional filtering controls
  showTimeUnit?: boolean;
  timeUnit?: TimeUnit;
  onTimeUnitChange?: (value: TimeUnit) => void;
  
  showProgramFilter?: boolean;
  programFilter?: string;
  onProgramFilterChange?: (value: string) => void;
  programs?: ProgramOption[];
}

export function ChartSection({
  title,
  description,
  icon,
  infoTooltip,
  children,
  showTimeUnit = false,
  timeUnit,
  onTimeUnitChange,
  showProgramFilter = false,
  programFilter,
  onProgramFilterChange,
  programs = []
}: ChartSectionProps) {
  return (
    <AnalyticsSection
      title={title}
      description={description}
      icon={icon}
      infoTooltip={infoTooltip}
    >
      {(showTimeUnit || showProgramFilter) && (
        <div className="flex items-center gap-4 mb-4">
          {showTimeUnit && timeUnit && onTimeUnitChange && (
            <TimeUnitSelector
              label="Time Period:"
              value={timeUnit}
              onValueChange={onTimeUnitChange}
            />
          )}
          {showProgramFilter && programFilter && onProgramFilterChange && (
            <ProgramSelector
              label="Program:"
              value={programFilter}
              onValueChange={onProgramFilterChange}
              programs={programs}
            />
          )}
        </div>
      )}
      {children}
    </AnalyticsSection>
  );
}

export type { ProgramOption }; 