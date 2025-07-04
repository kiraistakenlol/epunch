import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TimeUnit = 'days' | 'weeks' | 'months';

interface TimeUnitSelectorProps {
  label: string;
  value: TimeUnit;
  onValueChange: (value: TimeUnit) => void;
  className?: string;
}

export function TimeUnitSelector({ 
  label, 
  value, 
  onValueChange, 
  className = "w-[120px]"
}: TimeUnitSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium hidden sm:block">{label}</label>
      <Select value={value} onValueChange={(value) => onValueChange(value as TimeUnit)}>
        <SelectTrigger className={className}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="days">Days (12)</SelectItem>
          <SelectItem value="weeks">Weeks (12)</SelectItem>
          <SelectItem value="months">Months (12)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export type { TimeUnit }; 