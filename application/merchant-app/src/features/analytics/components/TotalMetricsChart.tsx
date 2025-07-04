import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface TotalMetricsChartProps {
  data: {
    totalUsers: number;
    totalPunches: number;
    totalCards: number;
    activeCards: number;
    readyCards: number;
    redeemedCards: number;
  };
}

export function TotalMetricsChart({ data }: TotalMetricsChartProps) {
  const pieData = [
    { name: 'Active Cards', value: data.activeCards, color: '#3b82f6' },
    { name: 'Ready Cards', value: data.readyCards, color: '#10b981' },
    { name: 'Redeemed Cards', value: data.redeemedCards, color: '#6b7280' },
  ];

  const barData = [
    { name: 'Total Users', value: data.totalUsers, color: '#8b5cf6' },
    { name: 'Total Punches', value: data.totalPunches, color: '#f97316' },
    { name: 'Total Cards', value: data.totalCards, color: '#3b82f6' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">
            {payload[0].name}: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

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
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Total Metrics Overview</h3>
        <p className="text-sm text-gray-500">
          Complete overview of all business metrics and card status distribution
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Card Status Distribution */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-md font-medium text-gray-900 mb-4">Card Status Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
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

        {/* Bar Chart - Total Metrics */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-md font-medium text-gray-900 mb-4">Total Business Metrics</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
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
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{data.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-blue-600">Total Users</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-700">{data.totalPunches.toLocaleString()}</div>
          <div className="text-sm text-orange-600">Total Punches</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{data.totalCards.toLocaleString()}</div>
          <div className="text-sm text-green-600">Total Cards</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">
            {((data.redeemedCards / data.totalCards) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-purple-600">Completion Rate</div>
        </div>
      </div>
    </div>
  );
} 