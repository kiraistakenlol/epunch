import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PieChartWithLegend } from './PieChartWithLegend';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface CollapsiblePieChartSectionProps {
  title: string;
  icon: React.ReactNode;
  pieData: PieChartData[];
  defaultExpanded?: boolean;
}

export function CollapsiblePieChartSection({
  title,
  icon,
  pieData,
  defaultExpanded = true
}: CollapsiblePieChartSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <PieChartWithLegend
            pieData={pieData}
          />
        </div>
      )}
    </div>
  );
} 