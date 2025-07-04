import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import { ProgramSelector } from './ProgramSelector';
import { TimeUnitSelector, TimeUnit } from './TimeUnitSelector';

interface ProgramOption {
  id: string;
  name: string;
}

interface CollapsibleSectionProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  infoTooltip?: string;
  defaultExpanded?: boolean;
  
  // Optional filtering controls
  showTimeUnit?: boolean;
  timeUnit?: TimeUnit;
  onTimeUnitChange?: (value: TimeUnit) => void;
  
  showProgramFilter?: boolean;
  programFilter?: string;
  onProgramFilterChange?: (value: string) => void;
  programs?: ProgramOption[];
}

export function CollapsibleSection({ 
  title, 
  description, 
  icon, 
  children, 
  className = '',
  infoTooltip,
  defaultExpanded = true,
  showTimeUnit = false,
  timeUnit,
  onTimeUnitChange,
  showProgramFilter = false,
  programFilter,
  onProgramFilterChange,
  programs = []
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={className}>
      <div 
        className="flex items-start gap-4 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors duration-200 rounded-lg mx-[-1rem] px-4 md:cursor-default md:hover:bg-transparent md:mx-0 md:px-0"
        onClick={toggleExpanded}
      >
        {icon && (
          <div className="flex-shrink-0 mt-1">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed w-full md:w-auto max-w-[80%] md:max-w-none">{description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {infoTooltip && <InfoTooltip content={infoTooltip} />}
          <button 
            className="md:hidden text-orange-600 hover:text-orange-700 transition-colors p-2 rounded-md hover:bg-orange-50"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded();
            }}
            type="button"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="pl-0 md:pl-9">
          {(showTimeUnit || showProgramFilter) && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
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
        </div>
      </div>
    </div>
  );
}

export type { ProgramOption }; 