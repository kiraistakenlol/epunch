import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { apiClient } from 'e-punch-common-ui';
import { BundleProgramCreateDto, BundleProgramUpdateDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { 
  fetchBundlePrograms, 
  selectBundleProgramById, 
  selectBundleProgramsLoading 
} from '@/store/bundleProgramsSlice';
import type { AppDispatch } from '@/store/store';

const quantityPresetSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  validityDays: z.number().min(1, 'Validity must be at least 1 day').nullable(),
});

const formSchema = z.object({
  name: z.string().min(1, 'Program name is required').max(255, 'Program name is too long'),
  itemName: z.string().min(1, 'Item name is required').max(100, 'Item name is too long'),
  description: z.string().optional(),
  quantityPresets: z.array(quantityPresetSchema).min(1, 'At least one quantity preset is required'),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface BundleProgramFormProps {
  mode: 'create' | 'edit';
}

export function BundleProgramForm({ mode }: BundleProgramFormProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const merchantId = useAppSelector(state => state.merchant.merchant?.id);
  const bundleProgram = useAppSelector(state => id ? selectBundleProgramById(state, id) : null);
  const bundleProgramsLoading = useSelector(selectBundleProgramsLoading);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      itemName: '',
      description: '',
      quantityPresets: [{ quantity: 10, validityDays: 90 }],
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'quantityPresets',
  });

  useEffect(() => {
    if (mode === 'edit' && merchantId && !bundleProgram && !bundleProgramsLoading) {
      dispatch(fetchBundlePrograms(merchantId));
    }
  }, [mode, merchantId, bundleProgram, bundleProgramsLoading, dispatch]);

  useEffect(() => {
    if (mode === 'edit' && bundleProgram) {
      form.reset({
        name: bundleProgram.name,
        itemName: bundleProgram.itemName,
        description: bundleProgram.description || '',
        quantityPresets: bundleProgram.quantityPresets,
        isActive: bundleProgram.isActive,
      });
    }
  }, [mode, bundleProgram, form]);

  useEffect(() => {
    if (mode === 'edit' && id && merchantId && !bundleProgramsLoading && !bundleProgram) {
      toast.error('Bundle program not found');
      navigate('/bundle-programs');
    }
  }, [mode, id, merchantId, bundleProgramsLoading, bundleProgram, navigate]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const createData: BundleProgramCreateDto = {
          name: data.name.trim(),
          itemName: data.itemName.trim(),
          description: data.description?.trim() || undefined,
          quantityPresets: data.quantityPresets,
          isActive: data.isActive,
        };
        
        await apiClient.createBundleProgram(createData);
        toast.success('Bundle program created successfully');
      } else if (mode === 'edit' && id) {
        const updateData: BundleProgramUpdateDto = {
          name: data.name.trim(),
          itemName: data.itemName.trim(),
          description: data.description?.trim() || undefined,
          quantityPresets: data.quantityPresets,
          isActive: data.isActive,
        };
        
        await apiClient.updateBundleProgram(id, updateData);
        toast.success('Bundle program updated successfully');
      }
      
      navigate('/bundle-programs');
    } catch (error: any) {
      console.error(`Failed to ${mode} bundle program:`, error);
      toast.error(error.message || `Failed to ${mode} bundle program`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bundleProgramsLoading) {
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
          {mode === 'create' ? 'Create Bundle Program' : 'Edit Bundle Program'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Create a new bundle program to sell item packages to customers.' 
            : 'Update your bundle program details.'}
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
                    <Input placeholder="e.g., Gym Membership Package" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Gym Visit" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>What each unit in the bundle represents</FormDescription>
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Quantity Presets</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ quantity: 10, validityDays: 90 })}
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Preset
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`quantityPresets.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            placeholder="10" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`quantityPresets.${index}.validityDays`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Validity (Days)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            placeholder="90" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={isSubmitting}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Program</FormLabel>
                    <FormDescription>
                      Enable this program to allow bundle sales
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

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/bundle-programs')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Program' : 'Update Program'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 