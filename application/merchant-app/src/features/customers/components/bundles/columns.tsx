import { ColumnDef } from "@tanstack/react-table";
import { BundleDto } from "e-punch-common-core";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Package, Calendar, CheckCircle, Clock, AlertTriangle, MoreHorizontal, Edit3, Trash2 } from "lucide-react";

interface ColumnOptions {
  onUpdateBundle: (bundleId: string) => void;
  onDeleteBundle: (bundleId: string) => void;
}

export const createColumns = (
  formatDate: (dateString: string | undefined | null) => string,
  options?: ColumnOptions
): ColumnDef<BundleDto>[] => [
  {
    accessorKey: "itemName",
    header: "Item",
    cell: ({ row }) => {
      const bundle = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-sm">{bundle.itemName}</div>
            <div className="text-xs text-muted-foreground">
              {bundle.description || 'No description'}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const bundle = row.original;
      const usedQuantity = bundle.originalQuantity - bundle.remainingQuantity;
      const percentage = (usedQuantity / bundle.originalQuantity) * 100;
      
      return (
        <div className="w-full max-w-[200px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">
              {bundle.remainingQuantity} / {bundle.originalQuantity} left
            </span>
            <span className="font-medium">{Math.round(percentage)}% used</span>
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
      const bundle = row.original;
      const isExpired = bundle.expiresAt && new Date(bundle.expiresAt) < new Date();
      const isUsedUp = bundle.remainingQuantity === 0;
      
      const getStatus = () => {
        if (isUsedUp) return { text: 'Used Up', variant: 'secondary' as const, icon: CheckCircle };
        if (isExpired) return { text: 'Expired', variant: 'destructive' as const, icon: AlertTriangle };
        return { text: 'Active', variant: 'outline' as const, icon: Package };
      };

      const status = getStatus();
      const Icon = status.icon;
      
      return (
        <Badge variant={status.variant} className="gap-1">
          <Icon className="w-3 h-3" />
          {status.text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const bundle = row.original;
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDate(bundle.createdAt)}
        </div>
      );
    },
  },
  {
    accessorKey: "lastUsedAt",
    header: "Last Used",
    cell: ({ row }) => {
      const bundle = row.original;
      if (!bundle.lastUsedAt) {
        return <span className="text-xs text-muted-foreground">Never</span>;
      }
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatDate(bundle.lastUsedAt)}
        </div>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ row }) => {
      const bundle = row.original;
      if (!bundle.expiresAt) {
        return <span className="text-xs text-muted-foreground">Never</span>;
      }
      
      const isExpired = new Date(bundle.expiresAt) < new Date();
      
      return (
        <div className={`flex items-center gap-1 text-sm ${isExpired ? 'text-red-600' : 'text-muted-foreground'}`}>
          <AlertTriangle className={`w-3 h-3 ${isExpired ? 'text-red-600' : ''}`} />
          {formatDate(bundle.expiresAt)}
        </div>
      );
    },
  },
  ...(options ? [{
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: BundleDto } }) => {
      const bundle = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => options.onUpdateBundle(bundle.id)}
              className="cursor-pointer"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Update Bundle
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => options.onDeleteBundle(bundle.id)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Bundle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }] : []),
]; 