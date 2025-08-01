import { useState, useEffect } from 'react';
import { BundleDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Package, Plus, Minus, Loader2, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

interface UpdateBundleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bundle: BundleDto | null;
  onSuccess: () => void;
}

export function UpdateBundleModal({ open, onOpenChange, bundle, onSuccess }: UpdateBundleModalProps) {
  const [newRemainingQuantity, setNewRemainingQuantity] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open && bundle) {
      setNewRemainingQuantity(bundle.remainingQuantity);
    }
  }, [open, bundle]);

  const handleUpdate = async () => {
    if (!bundle) return;

    try {
      setIsProcessing(true);
      
      await apiClient.updateBundle(bundle.id, { remainingQuantity: newRemainingQuantity });
      
      const oldQuantity = bundle.remainingQuantity;
      const difference = newRemainingQuantity - oldQuantity;
      
      let message = '';
      if (difference > 0) {
        message = `📦 Restored ${difference}x ${bundle.itemName}. Remaining: ${newRemainingQuantity}`;
      } else if (difference < 0) {
        message = `✅ Used ${Math.abs(difference)}x ${bundle.itemName}. Remaining: ${newRemainingQuantity}`;
      } else {
        message = `No changes made to ${bundle.itemName}`;
      }
      
      toast.success('Bundle quantity updated!', {
        description: message
      });
      
      onSuccess();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Failed to update bundle quantity:', error);
      toast.error('Failed to update bundle', {
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isValidQuantity = newRemainingQuantity >= 0 && newRemainingQuantity <= (bundle?.originalQuantity || 0);
  const hasChanged = bundle && newRemainingQuantity !== bundle.remainingQuantity;

  if (!bundle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Update Bundle
          </DialogTitle>
          <DialogDescription>
            Update the remaining quantity for this bundle. Set to 0 to mark as fully used.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bundle Information */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="font-medium">{bundle.itemName}</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Original:</strong> {bundle.originalQuantity}</p>
              <p><strong>Current Remaining:</strong> {bundle.remainingQuantity}</p>
              <p><strong>Currently Used:</strong> {bundle.originalQuantity - bundle.remainingQuantity}</p>
            </div>
          </div>

          {/* Remaining Quantity Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              New Remaining Quantity
            </Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewRemainingQuantity(Math.max(0, newRemainingQuantity - 1))}
                disabled={newRemainingQuantity <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={newRemainingQuantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setNewRemainingQuantity(Math.max(0, Math.min(bundle.originalQuantity, value)));
                }}
                min={0}
                max={bundle.originalQuantity}
                className="text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewRemainingQuantity(Math.min(bundle.originalQuantity, newRemainingQuantity + 1))}
                disabled={newRemainingQuantity >= bundle.originalQuantity}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Range: 0 to {bundle.originalQuantity} (original quantity)
            </p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Set</Label>
            <div className="flex flex-wrap gap-2">
              {[0, Math.floor(bundle.originalQuantity * 0.25), Math.floor(bundle.originalQuantity * 0.5), Math.floor(bundle.originalQuantity * 0.75), bundle.originalQuantity]
                .filter((val, index, arr) => arr.indexOf(val) === index && val >= 0)
                .map((preset) => (
                  <Button
                    key={preset}
                    variant={newRemainingQuantity === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewRemainingQuantity(preset)}
                    className="text-xs"
                  >
                    {preset} {preset === 0 ? '(Empty)' : preset === bundle.originalQuantity ? '(Full)' : ''}
                  </Button>
                ))}
            </div>
          </div>

          {/* Change Preview */}
          {hasChanged && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <strong>Change Preview:</strong>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {bundle.remainingQuantity} → {newRemainingQuantity} remaining
                {newRemainingQuantity > bundle.remainingQuantity && (
                  <span className="text-green-600 ml-2">
                    (+{newRemainingQuantity - bundle.remainingQuantity} restored)
                  </span>
                )}
                {newRemainingQuantity < bundle.remainingQuantity && (
                  <span className="text-blue-600 ml-2">
                    (-{bundle.remainingQuantity - newRemainingQuantity} used)
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Validation Messages */}
          {!isValidQuantity && (
            <p className="text-sm text-destructive">
              Remaining quantity must be between 0 and {bundle.originalQuantity}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={!isValidQuantity || !hasChanged || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Update Bundle
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 