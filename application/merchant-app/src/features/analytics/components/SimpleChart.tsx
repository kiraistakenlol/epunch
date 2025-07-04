
import { DailyTrend } from 'e-punch-common-core';

interface SimpleChartProps {
  data: DailyTrend[];
}

export function SimpleChart({ data }: SimpleChartProps) {
  const maxPunches = Math.max(...data.map(d => d.punches));
  const maxCustomers = Math.max(...data.map(d => d.newCustomers));
  const maxRewards = Math.max(...data.map(d => d.rewardsRedeemed));
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2 text-xs text-center">
        {data.map((day, index) => (
          <div key={index} className="space-y-2">
            <div className="text-muted-foreground">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            
            {/* Punches Bar */}
            <div className="space-y-1">
              <div className="text-xs text-blue-600">Punches</div>
              <div className="h-16 bg-gray-100 rounded relative flex items-end">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ 
                    height: `${maxPunches > 0 ? (day.punches / maxPunches) * 100 : 0}%`,
                    minHeight: day.punches > 0 ? '4px' : '0px'
                  }}
                />
              </div>
              <div className="text-xs font-medium">{day.punches}</div>
            </div>
            
            {/* New Customers Bar */}
            <div className="space-y-1">
              <div className="text-xs text-green-600">New</div>
              <div className="h-8 bg-gray-100 rounded relative flex items-end">
                <div 
                  className="w-full bg-green-500 rounded-t"
                  style={{ 
                    height: `${maxCustomers > 0 ? (day.newCustomers / maxCustomers) * 100 : 0}%`,
                    minHeight: day.newCustomers > 0 ? '4px' : '0px'
                  }}
                />
              </div>
              <div className="text-xs font-medium">{day.newCustomers}</div>
            </div>
            
            {/* Rewards Bar */}
            <div className="space-y-1">
              <div className="text-xs text-orange-600">Rewards</div>
              <div className="h-8 bg-gray-100 rounded relative flex items-end">
                <div 
                  className="w-full bg-orange-500 rounded-t"
                  style={{ 
                    height: `${maxRewards > 0 ? (day.rewardsRedeemed / maxRewards) * 100 : 0}%`,
                    minHeight: day.rewardsRedeemed > 0 ? '4px' : '0px'
                  }}
                />
              </div>
              <div className="text-xs font-medium">{day.rewardsRedeemed}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Punches</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>New Customers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>Rewards</span>
        </div>
      </div>
    </div>
  );
} 