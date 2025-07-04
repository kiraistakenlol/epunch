import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useState } from 'react';
import { 
  ChartTooltip, 
  MetricToggle, 
  ChartContainer,
  formatDate,
  TimeUnit
} from './shared';

interface ActivityTrendData {
  date: string;
  newCustomers: number;
  punches: number;
  rewardsRedeemed: number;
  newCards: number;
}

interface ActivityTrendsChartProps {
  data: ActivityTrendData[];
  timeUnit: TimeUnit;
  programName?: string;
}

export function ActivityTrendsChart({ data, timeUnit, programName }: ActivityTrendsChartProps) {
  const [enabledMetrics, setEnabledMetrics] = useState({
    newCustomers: true,
    punches: true,
    rewardsRedeemed: true,
    newCards: true,
  });

  const metrics = [
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

  const chartData = data.map(item => ({
    ...item,
    date: formatDate(item.date, timeUnit)
  }));

  return (
    <>
      <MetricToggle
        metrics={metrics}
        enabledMetrics={enabledMetrics}
        onToggle={toggleMetric}
      />
      
      <ChartContainer>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 10,
              left: 5,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={(value) => value.toString()}
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
                  radius={[2, 2, 0, 0]}
                />
              )
            )}
          </BarChart>
        </ChartContainer>
    </>
  );
} 