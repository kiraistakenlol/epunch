"use client"

import { BundleProgramDto } from "e-punch-common-core"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/shared/data-display/DataTableColumnHeader"
import { StatusBadge } from "@/components/shared/data-display/StatusBadge"

export const createColumns = (): ColumnDef<BundleProgramDto>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Program Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "itemName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item" />
    ),
    cell: ({ row }) => <div>{row.getValue("itemName")}</div>,
  },
  {
    accessorKey: "quantityPresets",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available Quantities" />
    ),
    cell: ({ row }) => {
      const presets = row.getValue("quantityPresets") as any[];
      const quantities = presets.map(p => p.quantity).sort((a, b) => a - b);
      return <div>{quantities.join(", ")}</div>;
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return <StatusBadge status={isActive ? 'active' : 'inactive'}>{isActive ? 'Active' : 'Inactive'}</StatusBadge>
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
]

export const columns = createColumns() 