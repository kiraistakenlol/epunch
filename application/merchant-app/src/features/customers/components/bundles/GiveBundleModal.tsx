import { useState, useEffect } from 'react';
import { BundleProgramDto, BundleCreateDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';
import { useAppSelector } from '@/store/hooks';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface GiveBundleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  onSuccess: () => void;
}

export function GiveBundleModal({ open, onOpenChange, customerId, onSuccess }: GiveBundleModalProps) {
  const [bundlePrograms, setBundlePrograms] = useState<BundleProgramDto[]>([]);
  const [selectedBundleProgramId, setSelectedBundleProgramId] = useState<string>('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customQuantity, setCustomQuantity] = useState<number>(1);
  const [customValidityDays, setCustomValidityDays] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGiving, setIsGiving] = useState(false);

  const merchantId = useAppSelector((state) => state.auth.user?.merchantId);

  useEffect(() => {
    if (open && merchantId) {
      fetchBundlePrograms();
    }
  }, [open, merchantId]);

  // Update custom inputs when preset is selected
  useEffect(() => {
    if (selectedBundleProgramId) {
      const selectedProgram = bundlePrograms.find(p => p.id === selectedBundleProgramId);
      if (selectedProgram && selectedProgram.quantityPresets[selectedPresetIndex]) {
        const preset = selectedProgram.quantityPresets[selectedPresetIndex];
        setCustomQuantity(preset.quantity);
        setCustomValidityDays(preset.validityDays);
      }
    }
  }, [selectedBundleProgramId, selectedPresetIndex, bundlePrograms]);

  const fetchBundlePrograms = async () => {
    if (!merchantId) return;

    try {
      setLoading(true);
      const programs = await apiClient.getMerchantBundlePrograms(merchantId);
      const activePrograms = programs.filter(program => program.isActive);
      setBundlePrograms(activePrograms);
      
      if (activePrograms.length > 0) {
        setSelectedBundleProgramId(activePrograms[0].id);
        setSelectedPresetIndex(0);
      }
    } catch (error) {
      console.error('Failed to fetch bundle programs:', error);
      toast.error('Failed to load bundle programs');
    } finally {
      setLoading(false);
    }
  };

  const handleGiveBundle = async () => {
    if (!selectedBundleProgramId || !customerId || !merchantId) return;

    try {
      setIsGiving(true);
      
      const bundleData: BundleCreateDto = {
        userId: customerId,
        bundleProgramId: selectedBundleProgramId,
        quantity: customQuantity,
        validityDays: customValidityDays || undefined
      };
      
      const result = await apiClient.createBundle(bundleData);
      
      toast.success('Bundle given successfully!', {
        description: `${customQuantity}x ${result.itemName} has been added to the customer.`
      });
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setSelectedBundleProgramId('');
      setSelectedPresetIndex(0);
      setCustomQuantity(1);
      setCustomValidityDays(null);
      
    } catch (error: any) {
      console.error('Failed to give bundle:', error);
      toast.error('Failed to give bundle', {
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsGiving(false);
    }
  };

  const selectedProgram = bundlePrograms.find(p => p.id === selectedBundleProgramId);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Give Bundle
          </DialogTitle>
          <DialogDescription>
            Select a bundle program and quantity to give to this customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bundle Program Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Bundle Program</Label>
            <Select
              value={selectedBundleProgramId}
              onValueChange={(value) => {
                setSelectedBundleProgramId(value);
                setSelectedPresetIndex(0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a bundle program" />
              </SelectTrigger>
              <SelectContent>
                {bundlePrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4" />
                      <span>{program.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Presets */}
          {selectedProgram && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {selectedProgram.quantityPresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant={selectedPresetIndex === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPresetIndex(index)}
                    className="text-xs"
                  >
                    {preset.quantity}x
                    {preset.validityDays && ` • ${preset.validityDays}d`}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Bundle Preview */}
          {selectedProgram && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Package className="w-4 h-4 text-primary" />
                <span className="font-medium">{selectedProgram.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>{customQuantity}x</strong> {selectedProgram.itemName}
                {customValidityDays && (
                  <span> • Expires in {customValidityDays} days</span>
                )}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGiveBundle} 
            disabled={!selectedBundleProgramId || isGiving}
          >
            {isGiving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Giving...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Give Bundle
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 