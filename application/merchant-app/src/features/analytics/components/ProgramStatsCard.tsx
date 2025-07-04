import { CreditCard, Target, Award, Clock } from 'lucide-react';
import { ProgramStats } from 'e-punch-common-core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProgramStatsCardProps {
  program: ProgramStats;
}

export function ProgramStatsCard({ program }: ProgramStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="truncate">{program.name}</span>
          <Badge variant="outline" className="text-xs">
            {program.completionRate.toFixed(1)}% completion
          </Badge>
        </CardTitle>
        {program.description && (
          <p className="text-sm text-muted-foreground truncate">
            {program.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cards Overview */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CreditCard className="h-4 w-4 text-blue-500" />
            </div>
            <div className="font-semibold">{program.totalCards}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-orange-500" />
            </div>
            <div className="font-semibold">{program.activeCards}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 text-green-500" />
            </div>
            <div className="font-semibold">{program.completedCards}</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion Rate</span>
            <span className="font-medium">{program.completionRate.toFixed(1)}%</span>
          </div>
          <Progress value={program.completionRate} className="h-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{program.averageTimeToComplete.toFixed(1)} days</div>
              <div className="text-xs text-muted-foreground">Avg. completion</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{program.rewardsRedeemed}</div>
              <div className="text-xs text-muted-foreground">Rewards given</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 