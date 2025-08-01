import { useState, useEffect } from 'react';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';
import { useAppSelector } from '@/store/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Target } from 'lucide-react';
import { cn } from '@/lib/cn';
import { toast } from 'sonner';

interface AddPunchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  onSuccess: () => void;
}

export function AddPunchModal({ 
  open, 
  onOpenChange, 
  customerId,
  onSuccess 
}: AddPunchModalProps) {
  const merchantId = useAppSelector((state) => state.merchant.merchant?.id);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [selectedLoyaltyProgramId, setSelectedLoyaltyProgramId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPunching, setIsPunching] = useState(false);

  useEffect(() => {
    if (open && merchantId) {
      fetchLoyaltyPrograms();
    }
  }, [open, merchantId]);

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setSelectedLoyaltyProgramId('');
      setLoyaltyPrograms([]);
    }
  }, [open]);

  const fetchLoyaltyPrograms = async () => {
    if (!merchantId) return;

    setIsLoading(true);
    try {
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
      const activePrograms = programs.filter(p => p.isActive);
      setLoyaltyPrograms(activePrograms);
    } catch (error: any) {
      console.error('Failed to fetch loyalty programs:', error);
      toast.error('Failed to load loyalty programs');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePunch = async () => {
    if (!selectedLoyaltyProgramId || !customerId) return;

    setIsPunching(true);
    try {
      await apiClient.recordPunch(customerId, selectedLoyaltyProgramId);
      toast.success('Punch added successfully!');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to add punch:', error);
      toast.error(error.message || 'Failed to add punch');
    } finally {
      setIsPunching(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Loading programs...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Add Punch
          </DialogTitle>
          <DialogDescription>
            Select a loyalty program to add a punch for this customer.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loyaltyPrograms.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active programs</h3>
              <p className="text-muted-foreground">
                Create loyalty programs to start giving punches.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {loyaltyPrograms.map((program) => (
                <div
                  key={program.id}
                  onClick={() => setSelectedLoyaltyProgramId(program.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                    "hover:shadow-md active:scale-[0.98]",
                    selectedLoyaltyProgramId === program.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-primary flex-shrink-0" />
                        <h3 className="font-medium text-base leading-tight">{program.name}</h3>
                      </div>
                      {program.description && (
                        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                          {program.description}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="font-medium">{program.requiredPunches} punches</span> → {program.rewardDescription}
                      </p>
                    </div>
                    {selectedLoyaltyProgramId === program.id && (
                      <div className="flex-shrink-0 ml-3">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handlePunch}
            disabled={!selectedLoyaltyProgramId || isPunching}
          >
            {isPunching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Punch...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Add Punch
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 