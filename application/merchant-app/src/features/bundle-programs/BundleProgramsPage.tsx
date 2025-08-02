"use client"

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/data-display/DataTable';
import { useDataTable } from '@/components/shared/hooks/use-data-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/app/routes';
import { createColumns } from './components/columns';
import { useAppSelector } from '@/store/hooks';
import { 
  fetchBundlePrograms, 
  selectBundlePrograms, 
  selectBundleProgramsLoading, 
  selectBundleProgramsError 
} from '@/store/bundleProgramsSlice';
import type { AppDispatch } from '@/store/store';
import type { BundleProgramDto } from 'e-punch-common-core';

export default function BundleProgramsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const merchantId = useAppSelector(state => state.merchant.merchant?.id);
  const bundlePrograms = useSelector(selectBundlePrograms);
  const loading = useSelector(selectBundleProgramsLoading);
  const error = useSelector(selectBundleProgramsError);

  useEffect(() => {
    if (merchantId) {
      dispatch(fetchBundlePrograms(merchantId));
    }
  }, [dispatch, merchantId]);

  const columns = useMemo(() => createColumns(), []);

  const table = useDataTable({
    data: bundlePrograms,
    columns,
  });

  const handleRowClick = (program: BundleProgramDto) => {
    navigate(`/bundle-programs/${program.id}`);
  };

  const handleCreateClick = () => {
    navigate(ROUTES.BUNDLE_PROGRAMS_CREATE);
  };

  if (loading || (bundlePrograms.length === 0 && !error)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bundle Programs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-8 w-[150px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bundle Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">
            Error loading bundle programs: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bundle Programs</CardTitle>
        <Button onClick={handleCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Create Bundle Program
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable 
          table={table.table} 
          onRowClick={handleRowClick}
        />
      </CardContent>
    </Card>
  );
} 