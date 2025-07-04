import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useState } from 'react';
import { 
  ChartTooltip, 
  MetricToggle, 
  ChartContainer,
  MetricConfig
} from './shared';

interface DaysOfWeekData {
  day: string;
  newCustomers: number;
  punches: number;
  rewardsRedeemed: number;
  newCards: number;
}

interface DaysOfWeekChartProps {
  data: DaysOfWeekData[];
  programName?: string;
}

export function DaysOfWeekChart({ data, programName }: DaysOfWeekChartProps) {
  const [enabledMetrics, setEnabledMetrics] = useState({
    newCustomers: true,
    punches: true,
    rewardsRedeemed: true,
    newCards: true,
  });

  const metrics: MetricConfig[] = [
    { key: 'newCustomers', label: 'New Customers', color: '#8b5cf6' },
    { key: 'punches', label: 'Punches', color: '#f97316' },
    { key: 'rewardsRedeemed', label: 'Rewards Redeemed', color: '#10b981' },
    { key: 'newCards', label: 'New Cards', color: '#3b82f6' },
  ];

  const toggleMetric = (metricKey: string) => {
    setEnabledMetrics(prev => ({
      ...prev,
      [metricKey]: !prev[metricKey as keyof typeof prev]
    }));
  };

  return (
    <>
      <MetricToggle
        metrics={metrics}
        enabledMetrics={enabledMetrics}
        onToggle={toggleMetric}
      />
      
      <ChartContainer>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip programName={programName} />} />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px'
              }}
            />
            {metrics.map((metric) => 
              enabledMetrics[metric.key as keyof typeof enabledMetrics] && (
                <Bar
                  key={metric.key}
                  dataKey={metric.key}
                  fill={metric.color}
                  name={metric.label}
                  radius={[4, 4, 0, 0]}
                />
              )
            )}
          </BarChart>
        </ChartContainer>
    </>
  );
} 