import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const statusBadgeVariants = cva(
  "font-semibold",
  {
    variants: {
      status: {
        active: "border-transparent bg-green-500 text-primary-foreground hover:bg-green-500/80",
        inactive: "border-transparent bg-stone-400 text-secondary-foreground hover:bg-stone-400/80",
        pending: "border-transparent bg-yellow-500 text-primary-foreground hover:bg-yellow-500/80",
        archived: "border-transparent bg-gray-500 text-primary-foreground hover:bg-gray-500/80",
        failed: "border-transparent bg-red-500 text-primary-foreground hover:bg-red-500/80",
      },
    },
    defaultVariants: {
      status: "inactive",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    />
  )
}

export { StatusBadge, statusBadgeVariants } 