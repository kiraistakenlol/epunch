interface CompactMetric {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  colorClass: string;
  growth?: {
    percentage: number;
    isPositive: boolean;
  };
}

interface CompactMetricsGridProps {
  metrics: CompactMetric[];
}

export function CompactMetricsGrid({ metrics }: CompactMetricsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={`${metric.colorClass} p-3 rounded-lg text-center`}
        >
          <div className="text-2xl mb-1 flex justify-center">{metric.icon}</div>
          <div className="text-lg font-bold">{metric.value}</div>
          <div className="text-xs opacity-90">{metric.label}</div>
          {metric.growth && metric.growth.isPositive && (
            <div className="text-xs mt-1 font-medium text-green-700">
              ↗ {metric.growth.percentage}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 