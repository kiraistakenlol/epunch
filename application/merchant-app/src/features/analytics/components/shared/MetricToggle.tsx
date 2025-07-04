export interface MetricConfig {
  key: string;
  label: string;
  color: string;
}

interface MetricToggleProps {
  metrics: MetricConfig[];
  enabledMetrics: Record<string, boolean>;
  onToggle: (metricKey: string) => void;
}

export function MetricToggle({ metrics, enabledMetrics, onToggle }: MetricToggleProps) {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Show Metrics:</h4>
      <div className="flex flex-wrap gap-3">
        {metrics.map((metric) => (
          <label key={metric.key} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={enabledMetrics[metric.key]}
              onChange={() => onToggle(metric.key)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div 
              className="w-3 h-3 rounded flex-shrink-0" 
              style={{ backgroundColor: metric.color }}
            />
            <span className="text-gray-700">{metric.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
} 