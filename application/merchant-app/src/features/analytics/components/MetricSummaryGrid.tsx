interface MetricSummaryItem {
  value: number;
  label: string;
  colorClass: string;
}

interface MetricSummaryGridProps {
  metrics: MetricSummaryItem[];
}

export function MetricSummaryGrid({ metrics }: MetricSummaryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={`${metric.colorClass} p-4 rounded-lg ${
            index === 2 ? 'col-span-2 md:col-span-1' : ''
          }`}
        >
          <div className="text-2xl font-bold">
            {metric.value.toLocaleString()}
          </div>
          <div className="text-sm">{metric.label}</div>
        </div>
      ))}
    </div>
  );
} 