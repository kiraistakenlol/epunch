import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from 'e-punch-common-ui';
import { UpdateLoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../store/hooks';
import { 
  EpunchInput, 
  EpunchSwitch, 
  EpunchPage,
  EpunchNumberInput,
  EpunchForm
} from '../../components/foundational';

export const LoyaltyProgramEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const merchantId = useAppSelector(state => state.auth.merchant?.id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requiredPunches: 10,
    rewardDescription: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadLoyaltyProgram();
  }, [id, merchantId]);

  const loadLoyaltyProgram = async () => {
    if (!id || !merchantId) {
      setLoadError('Invalid program ID or merchant not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
      const program = programs.find(p => p.id === id);

      if (!program) {
        setLoadError('Loyalty program not found');
        return;
      }

      setFormData({
        name: program.name,
        description: program.description || '',
        requiredPunches: program.requiredPunches,
        rewardDescription: program.rewardDescription,
        isActive: program.isActive,
      });
      setLoadError(null);
    } catch (err: any) {
      console.error('Failed to load loyalty program:', err);
      setLoadError(err.message || 'Failed to load loyalty program');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Program name is required';
    }

    if (!formData.rewardDescription.trim()) {
      newErrors.rewardDescription = 'Reward description is required';
    }

    if (formData.requiredPunches < 1) {
      newErrors.requiredPunches = 'Required punches must be at least 1';
    }

    if (formData.requiredPunches > 10) {
      newErrors.requiredPunches = 'Required punches cannot exceed 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !merchantId || !id) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const updateData: UpdateLoyaltyProgramDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        requiredPunches: formData.requiredPunches,
        rewardDescription: formData.rewardDescription.trim(),
        isActive: formData.isActive,
      };

      await apiClient.updateLoyaltyProgram(merchantId, id, updateData);
      navigate('/loyalty-programs');
    } catch (err: any) {
      console.error('Failed to update loyalty program:', err);
      setSubmitError(err.message || 'Failed to update loyalty program');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: any = e.target.value;
    
    if (field !== 'requiredPunches') {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePunchesChange = (value: number | undefined) => {
    setFormData(prev => ({ ...prev, requiredPunches: value || 0 }));
    
    if (errors.requiredPunches) {
      setErrors(prev => ({ ...prev, requiredPunches: '' }));
    }
  };

  const handleSwitchChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.checked }));
  };

  if (isLoading) {
    return (
      <EpunchPage title="Edit Loyalty Program" backTo="/loyalty-programs" loading>
        <></>
      </EpunchPage>
    );
  }

  if (loadError) {
    return (
      <EpunchPage title="Edit Loyalty Program" backTo="/loyalty-programs" error={loadError}>
        <></>
      </EpunchPage>
    );
  }

  return (
    <EpunchPage title="Edit Loyalty Program" backTo="/loyalty-programs">
      <EpunchForm 
        error={submitError}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/loyalty-programs')}
        submitText="Update Program"
        isSubmitting={isSubmitting}
      >
        <EpunchInput
          label="Program Name"
          value={formData.name}
          onChange={handleInputChange('name')}
          error={!!errors.name}
          helperText={errors.name}
          required
          disabled={isSubmitting}
        />

        <EpunchInput
          label="Description (Optional)"
          value={formData.description}
          onChange={handleInputChange('description')}
          disabled={isSubmitting}
          multiline
          rows={3}
        />

        <EpunchNumberInput
          label="Required Punches"
          value={formData.requiredPunches}
          onValueChange={handlePunchesChange}
          min={1}
          max={10}
          placeholder="Enter 1-10"
          error={!!errors.requiredPunches}
          helperText={errors.requiredPunches || 'Maximum 10 punches allowed'}
          required
          disabled={isSubmitting}
        />

        <EpunchInput
          label="Reward Description"
          value={formData.rewardDescription}
          onChange={handleInputChange('rewardDescription')}
          error={!!errors.rewardDescription}
          helperText={errors.rewardDescription}
          multiline
          rows={2}
          required
          disabled={isSubmitting}
          placeholder="e.g., Free coffee, 20% discount, etc."
        />

        <EpunchSwitch
          checked={formData.isActive}
          onChange={handleSwitchChange('isActive')}
          disabled={isSubmitting}
          label="Active"
          variant="primary"
        />
      </EpunchForm>
    </EpunchPage>
  );
}; 