"use client"

import * as React from "react"
import { apiClient } from "e-punch-common-ui"
import { LoyaltyProgramDto } from "e-punch-common-core"
import { useAppSelector } from "@/store/hooks"
import { createColumns } from "./components/columns"
import { DataTable } from "@/components/shared/data-display/DataTable"
import { useDataTable } from "@/components/shared/hooks/use-data-table"
import { DataTablePagination } from "@/components/shared/data-display/DataTablePagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/lib/cn"

export function V2LoyaltyProgramsPage() {
  const navigate = useNavigate()
  const merchantId = useAppSelector((state) => state.merchant.merchant?.id)
  const [data, setData] = React.useState<LoyaltyProgramDto[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchData = React.useCallback(async () => {
    if (!merchantId) return
    setIsLoading(true)
    try {
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId)
      setData(programs)
    } catch (error) {
      console.error("Failed to fetch loyalty programs:", error)
    } finally {
      setIsLoading(false)
    }
  }, [merchantId])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const columns = React.useMemo(() => createColumns(), [])

  const table = useDataTable({
    data,
    columns,
  })

  const handleRowClick = (program: LoyaltyProgramDto) => {
    navigate(`/loyalty-programs/${program.id}`)
  }

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Loyalty Programs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-8 w-[150px]" />
                </div>
                <Skeleton className="h-[400px] w-full" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-[100px]" />
                    <Skeleton className="h-8 w-[200px]" />
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Loyalty Programs</CardTitle>
            <Button onClick={() => navigate(ROUTES.LOYALTY_PROGRAMS_CREATE)}>
              Create Program
            </Button>
        </CardHeader>
        <CardContent className="space-y-4">
            <DataTable 
              table={table.table} 
              onRowClick={handleRowClick}
            />
            <DataTablePagination table={table.table} />
        </CardContent>
    </Card>
  )
} 