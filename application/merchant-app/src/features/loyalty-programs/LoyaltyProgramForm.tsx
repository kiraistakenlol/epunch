import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from 'e-punch-common-ui';
import { CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/cn';

const formSchema = z.object({
  name: z.string().min(1, 'Program name is required'),
  description: z.string().optional(),
  requiredPunches: z.number().min(1, 'Required punches must be at least 1').max(10, 'Maximum 10 punches allowed'),
  rewardDescription: z.string().min(1, 'Reward description is required'),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface LoyaltyProgramFormProps {
  mode: 'create' | 'edit';
}

export function LoyaltyProgramForm({ mode }: LoyaltyProgramFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const merchantId = useAppSelector(state => state.merchant.merchant?.id);
  
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      requiredPunches: 10,
      rewardDescription: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (mode === 'edit' && id && merchantId) {
      loadLoyaltyProgram();
    }
  }, [mode, id, merchantId]);

  const loadLoyaltyProgram = async () => {
    if (!id || !merchantId) return;

    try {
      setIsLoading(true);
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
      const program = programs.find(p => p.id === id);

      if (!program) {
        toast.error('Loyalty program not found');
        navigate(ROUTES.LOYALTY_PROGRAMS);
        return;
      }

      form.reset({
        name: program.name,
        description: program.description || '',
        requiredPunches: program.requiredPunches,
        rewardDescription: program.rewardDescription,
        isActive: program.isActive,
      });
    } catch (error: any) {
      console.error('Failed to load loyalty program:', error);
      toast.error(error.message || 'Failed to load loyalty program');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!merchantId) return;

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const createData: CreateLoyaltyProgramDto = {
          name: data.name.trim(),
          description: data.description?.trim() || undefined,
          requiredPunches: data.requiredPunches,
          rewardDescription: data.rewardDescription.trim(),
          isActive: data.isActive,
        };
        
        await apiClient.createLoyaltyProgram(merchantId, createData);
        toast.success('Loyalty program created successfully');
      } else if (mode === 'edit' && id) {
        const updateData: UpdateLoyaltyProgramDto = {
          name: data.name.trim(),
          description: data.description?.trim() || undefined,
          requiredPunches: data.requiredPunches,
          rewardDescription: data.rewardDescription.trim(),
          isActive: data.isActive,
        };
        
        await apiClient.updateLoyaltyProgram(merchantId, id, updateData);
        toast.success('Loyalty program updated successfully');
      }
      
      navigate(ROUTES.LOYALTY_PROGRAMS);
    } catch (error: any) {
      console.error(`Failed to ${mode} loyalty program:`, error);
      toast.error(error.message || `Failed to ${mode} loyalty program`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create Loyalty Program' : 'Edit Loyalty Program'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Create a new loyalty program for your customers.' 
            : 'Update your loyalty program details.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter program name" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter program description" 
                      className="resize-none" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredPunches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Punches</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="10" 
                      placeholder="Enter 1-10" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>Maximum 10 punches allowed</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rewardDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Free coffee, 20% discount, etc." 
                      className="resize-none" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Whether this loyalty program is currently active
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting 
                  ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                  : (mode === 'create' ? 'Create Program' : 'Update Program')
                }
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(ROUTES.LOYALTY_PROGRAMS)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 