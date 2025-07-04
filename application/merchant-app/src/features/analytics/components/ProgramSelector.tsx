import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProgramOption {
  id: string;
  name: string;
}

interface ProgramSelectorProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  programs: ProgramOption[];
  placeholder?: string;
  className?: string;
}

export function ProgramSelector({ 
  label, 
  value, 
  onValueChange, 
  programs, 
  placeholder = "All Programs",
  className = "w-[200px] sm:w-[180px]"
}: ProgramSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium hidden sm:block">{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Programs</SelectItem>
          {programs.map((program) => (
            <SelectItem key={program.id} value={program.id}>
              {program.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 