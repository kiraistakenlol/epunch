import * as React from "react";
import { PunchCardDto } from "e-punch-common-core";
import { createColumns } from "./columns";
import { DataTable } from "@/components/shared/data-display/DataTable";
import { useDataTable } from "@/components/shared/hooks/use-data-table";
import { DataTablePagination } from "@/components/shared/data-display/DataTablePagination";

interface PunchCardsTableProps {
  data: PunchCardDto[];
  formatDate: (dateString: string | undefined | null) => string;
}

export function PunchCardsTable({ data, formatDate }: PunchCardsTableProps) {
  const columns = React.useMemo(() => createColumns(formatDate), [formatDate]);

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