import * as React from "react";
import { BundleDto } from "e-punch-common-core";
import { createColumns } from "./columns";
import { DataTable } from "@/components/shared/data-display/DataTable";
import { useDataTable } from "@/components/shared/hooks/use-data-table";
import { DataTablePagination } from "@/components/shared/data-display/DataTablePagination";

interface BundlesTableProps {
  data: BundleDto[];
  formatDate: (dateString: string | undefined | null) => string;
  onUpdateBundle?: (bundleId: string) => void;
  onDeleteBundle?: (bundleId: string) => void;
}

export function BundlesTable({ 
  data, 
  formatDate, 
  onUpdateBundle, 
  onDeleteBundle 
}: BundlesTableProps) {
  const columns = React.useMemo(() => createColumns(
    formatDate,
    onUpdateBundle && onDeleteBundle ? {
      onUpdateBundle,
      onDeleteBundle
    } : undefined
  ), [formatDate, onUpdateBundle, onDeleteBundle]);

  const table = useDataTable({
    data,
    columns,
  });

  return (
    <div className="space-y-4">
      <DataTable table={table.table} />
      <DataTablePagination table={table.table} />
    </div>
  );
} 