"use client"

import { LoyaltyProgramDto } from "e-punch-common-core"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableRowActions } from "./data-table-row-actions"
import { DataTableColumnHeader } from "@/components/v2/data-display/DataTableColumnHeader"
import { StatusBadge } from "@/components/v2/data-display/StatusBadge"

export const createColumns = (onDelete?: () => void): ColumnDef<LoyaltyProgramDto>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "rewardDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reward" />
    ),
    cell: ({ row }) => <div>{row.getValue("rewardDescription")}</div>,
  },
  {
    accessorKey: "requiredPunches",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Punches" />
    ),
    cell: ({ row }) => <div>{row.getValue("requiredPunches")}</div>,
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
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} onDelete={onDelete} />,
  },
]

// Default export for backward compatibility
export const columns = createColumns() 