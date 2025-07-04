interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  programName?: string;
  formatValue?: (value: any) => string;
}

export function ChartTooltip({ active, payload, label, programName, formatValue }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const defaultFormatter = (value: any) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  const formatter = formatValue || defaultFormatter;

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-medium text-gray-900 mb-2">{label}</p>
      {programName && (
        <p className="text-sm text-gray-600 mb-2">Program: {programName}</p>
      )}
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          <span className="font-medium">{entry.name}:</span> {formatter(entry.value)}
        </p>
      ))}
    </div>
  );
} 