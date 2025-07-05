import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit } from 'lucide-react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { ROUTES } from '@/lib/cn';
import { toast } from 'sonner';

export function LoyaltyProgramPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const merchantId = useAppSelector(state => state.merchant.merchant?.id);
  
  const [program, setProgram] = useState<LoyaltyProgramDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && merchantId) {
      loadLoyaltyProgram();
    }
  }, [id, merchantId]);

  const loadLoyaltyProgram = async () => {
    if (!id || !merchantId) return;

    try {
      setIsLoading(true);
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
      const foundProgram = programs.find(p => p.id === id);

      if (!foundProgram) {
        toast.error('Loyalty program not found');
        navigate(ROUTES.LOYALTY_PROGRAMS);
        return;
      }

      setProgram(foundProgram);
    } catch (error: any) {
      console.error('Failed to load loyalty program:', error);
      toast.error(error.message || 'Failed to load loyalty program');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (program) {
      navigate(`/loyalty-programs/${program.id}/edit`);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  if (!program) {
    return (
      <PageContainer>
        <Card>
          <CardHeader>
            <CardTitle>Program not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(ROUTES.LOYALTY_PROGRAMS)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Loyalty Programs
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.LOYALTY_PROGRAMS)}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">{program.name}</h1>
          </div>
          <Button onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Program Details</CardTitle>
              <Badge variant={program.isActive ? "default" : "secondary"}>
                {program.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {program.description && (
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{program.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Required Punches</h3>
                <div className="text-2xl font-bold text-primary">{program.requiredPunches}</div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Created</h3>
                <div className="text-muted-foreground">
                  {new Date(program.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Reward</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">{program.rewardDescription}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
} 