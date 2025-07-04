import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  ChartTooltip, 
  ChartContainer,
  formatDate,
  TimeUnit
} from './shared';

interface GrowthTrendData {
  date: string;
  totalUsers: number;
  totalPunches: number;
  totalCards: number;
  totalRewardsRedeemed: number;
}

interface GrowthTrendsChartProps {
  data: GrowthTrendData[];
  timeUnit: TimeUnit;
  programName?: string;
}

export function GrowthTrendsChart({ data, timeUnit, programName }: GrowthTrendsChartProps) {
  const chartData = data.map(item => ({
    ...item,
    date: formatDate(item.date, timeUnit)
  }));

  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <ChartContainer>
          <AreaChart
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
              width={50}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}k`;
                }
                return value.toString();
              }}
            />
            <Tooltip content={<ChartTooltip programName={programName} formatValue={formatValue} />} />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px'
              }}
            />
            <Area
              type="monotone"
              dataKey="totalUsers"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
              strokeWidth={2}
              name="Total Users"
            />
            <Area
              type="monotone"
              dataKey="totalPunches"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.3}
              strokeWidth={2}
              name="Total Punches"
            />
            <Area
              type="monotone"
              dataKey="totalCards"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
              name="Total Cards"
            />
            <Area
              type="monotone"
              dataKey="totalRewardsRedeemed"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
              strokeWidth={2}
              name="Total Rewards Redeemed"
            />
          </AreaChart>
        </ChartContainer>
  );
} 