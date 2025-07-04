import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}



interface PieChartWithLegendProps {
  pieData: PieChartData[];
}

export function PieChartWithLegend({ 
  pieData
}: PieChartWithLegendProps) {
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">
            {data.name}: {data.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center min-h-[360px]">
        <div className="w-80 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                fontSize={14}
                fontWeight="bold"
                stroke="#fff"
                strokeWidth={1}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center">
        {pieData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700 font-medium">
              {entry.name}
            </span>
            <span className="text-sm text-gray-500">
              ({entry.value.toLocaleString()})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 