import { ColumnDef } from "@tanstack/react-table";
import { PunchCardDto } from "e-punch-common-core";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, CheckCircle } from "lucide-react";

export const createColumns = (
  formatDate: (dateString: string | undefined | null) => string
): ColumnDef<PunchCardDto>[] => [
  {
    accessorKey: "loyaltyProgramId",
    header: "Program",
    cell: ({ row }) => {
      const card = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-sm">{card.shopName}</div>
            <div className="text-xs text-muted-foreground">{card.shopAddress}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const card = row.original;
      const percentage = (card.currentPunches / card.totalPunches) * 100;
      
      return (
        <div className="w-full max-w-[200px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">
              {card.currentPunches} / {card.totalPunches}
            </span>
            <span className="font-medium">{Math.round(percentage)}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      
      const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
          case 'REWARD_READY': return 'default';
          case 'REWARD_REDEEMED': return 'secondary';
          case 'ACTIVE':
          default: return 'outline';
        }
      };

      const getStatusText = (status: string) => {
        switch (status) {
          case 'REWARD_READY': return 'Reward Ready';
          case 'REWARD_REDEEMED': return 'Redeemed';
          case 'ACTIVE':
          default: return 'Active';
        }
      };

      const getStatusIcon = (status: string) => {
        switch (status) {
          case 'REWARD_READY': return <CheckCircle className="w-3 h-3" />;
          case 'REWARD_REDEEMED': return <CheckCircle className="w-3 h-3" />;
          case 'ACTIVE':
          default: return <Target className="w-3 h-3" />;
        }
      };
      
      return (
        <Badge variant={getStatusVariant(status)} className="gap-1">
          {getStatusIcon(status)}
          {getStatusText(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const card = row.original;
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDate(card.createdAt)}
        </div>
      );
    },
  },
  {
    accessorKey: "lastPunchAt",
    header: "Last Punch",
    cell: ({ row }) => {
      const card = row.original;
      if (!card.lastPunchAt) {
        return <span className="text-xs text-muted-foreground">Never</span>;
      }
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDate(card.lastPunchAt)}
        </div>
      );
    },
  },
  {
    accessorKey: "completedAt",
    header: "Completed",
    cell: ({ row }) => {
      const card = row.original;
      if (!card.completedAt) {
        return <span className="text-xs text-muted-foreground">-</span>;
      }
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <CheckCircle className="w-3 h-3 text-green-600" />
          {formatDate(card.completedAt)}
        </div>
      );
    },
  },
]; 