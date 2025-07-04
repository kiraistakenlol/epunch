import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LoyaltyProgramData {
  loyaltyProgramId: string;
  name: string;
  description: string | null;
  totalCards: number;
  completionRate: number;
  averageTimeToComplete: number;
  rewardsRedeemed: number;
  activeCards: number;
  completedCards: number;
}

interface LoyaltyProgramCardProps {
  program: LoyaltyProgramData;
}

export function LoyaltyProgramCard({ program }: LoyaltyProgramCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{program.name}</CardTitle>
          <Badge variant="outline">{program.totalCards} cards</Badge>
        </div>
        {program.description && (
          <CardDescription>{program.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Completion Rate</span>
          <span className="font-medium">{program.completionRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Avg. Completion Time</span>
          <span className="font-medium">{program.averageTimeToComplete.toFixed(1)} days</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Rewards Redeemed</span>
          <span className="font-medium">{program.rewardsRedeemed}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-sm font-medium text-blue-600">{program.activeCards}</div>
            <div className="text-xs text-blue-500">Active</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-sm font-medium text-green-600">{program.completedCards}</div>
            <div className="text-xs text-green-500">Completed</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-sm font-medium text-gray-600">{program.rewardsRedeemed}</div>
            <div className="text-xs text-gray-500">Redeemed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export type { LoyaltyProgramData }; 