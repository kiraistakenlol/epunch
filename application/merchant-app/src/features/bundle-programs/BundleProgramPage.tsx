import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/store/hooks';
import { 
  fetchBundlePrograms,
  selectBundleProgramById,
  selectBundleProgramsLoading
} from '@/store/bundleProgramsSlice';
import { apiClient } from 'e-punch-common-ui';
import type { AppDispatch } from '@/store/store';

export default function BundleProgramPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const merchantId = useAppSelector(state => state.merchant.merchant?.id);
  const program = useAppSelector(state => id ? selectBundleProgramById(state, id) : null);
  const loading = useSelector(selectBundleProgramsLoading);

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (merchantId && !program && !loading) {
      dispatch(fetchBundlePrograms(merchantId));
    }
  }, [merchantId, program, loading, dispatch]);

  useEffect(() => {
    if (!loading && !program && id) {
      toast.error('Bundle program not found');
      navigate('/bundle-programs');
    }
  }, [loading, program, id, navigate]);

  const handleEdit = () => {
    navigate(`/bundle-programs/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!program) return;
    
    if (!confirm('Are you sure you want to delete this bundle program? Existing bundles will remain intact.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiClient.deleteBundleProgram(program.id);
      toast.success('Bundle program deleted successfully');
      navigate('/bundle-programs');
    } catch (error: any) {
      console.error('Failed to delete bundle program:', error);
      toast.error(error.message || 'Failed to delete bundle program');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!program) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/bundle-programs')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>
          <h1 className="text-2xl font-semibold">{program.name}</h1>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            disabled={isDeleting}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Program Details</CardTitle>
              <Badge variant={program.isActive ? 'default' : 'secondary'}>
                {program.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Program Name</label>
              <p className="text-lg">{program.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Item Name</label>
              <p className="text-lg">{program.itemName}</p>
            </div>
            
            {program.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-lg">{program.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quantity Presets</CardTitle>
            <CardDescription>
              Available quantity options for this bundle program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {program.quantityPresets.map((preset, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="text-2xl font-bold">{preset.quantity}</div>
                  <div className="text-sm text-muted-foreground">
                    {preset.quantity === 1 ? program.itemName : `${program.itemName}s`}
                  </div>
                  {preset.validityDays && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Valid for {preset.validityDays} days
                    </div>
                  )}
                  {!preset.validityDays && (
                    <div className="text-sm text-muted-foreground mt-2">
                      No expiration
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 