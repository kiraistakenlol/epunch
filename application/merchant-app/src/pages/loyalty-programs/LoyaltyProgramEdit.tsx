import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from 'e-punch-common-ui';
import { UpdateLoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../store/hooks';
import { EpunchPage, FormContainer, FormField, useFormState, EpunchSwitch } from '../../components/foundational';
import styles from './LoyaltyProgramEdit.module.css';

interface LoyaltyProgramFormData {
  name: string;
  description: string;
  requiredPunches: number;
  rewardDescription: string;
  isActive: boolean;
}

export const LoyaltyProgramEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const merchantId = useAppSelector(state => state.merchant.merchant?.id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { formData, errors, handleFieldChange, handleNumberChange, handleSwitchChange, validateForm, setFormData } = useFormState<LoyaltyProgramFormData>({
    name: '',
    description: '',
    requiredPunches: 10,
    rewardDescription: '',
    isActive: true,
  }, {
    name: { required: true },
    rewardDescription: { required: true },
    requiredPunches: { required: true, min: 1, max: 10 }
  });

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

  if (isLoading) {
    return (
      <EpunchPage title="Edit Loyalty Program">
        <div>Loading...</div>
      </EpunchPage>
    );
  }

  if (loadError) {
    return (
      <EpunchPage title="Edit Loyalty Program">
        <div>Error: {loadError}</div>
      </EpunchPage>
    );
  }

  return (
    <EpunchPage title="Edit Loyalty Program">
      <FormContainer
        onSubmit={handleSubmit}
        onCancel={() => navigate('/loyalty-programs')}
        submitText="Update Program"
        submittingText="Updating..."
        isSubmitting={isSubmitting}
        error={submitError}
        variant="card"
        fieldSpacing="md"
      >
        <FormField
          label="Program Name"
          value={formData.name}
          onChange={handleFieldChange('name')}
          error={!!errors.name}
          helperText={errors.name}
          required
          disabled={isSubmitting}
        />

        <FormField
          label="Description (Optional)"
          value={formData.description}
          onChange={handleFieldChange('description')}
          disabled={isSubmitting}
          multiline
          rows={3}
        />

        <FormField
          label="Required Punches"
          type="number"
          value={formData.requiredPunches.toString()}
          onChange={(e) => handleNumberChange('requiredPunches')(parseInt(e.target.value) || 0)}
          error={!!errors.requiredPunches}
          helperText={errors.requiredPunches || 'Maximum 10 punches allowed'}
          required
          disabled={isSubmitting}
          placeholder="Enter 1-10"
        />

        <FormField
          label="Reward Description"
          value={formData.rewardDescription}
          onChange={handleFieldChange('rewardDescription')}
          error={!!errors.rewardDescription}
          helperText={errors.rewardDescription}
          multiline
          rows={2}
          required
          disabled={isSubmitting}
          placeholder="e.g., Free coffee, 20% discount, etc."
        />

        <div className={styles.switchContainer}>
          <EpunchSwitch
            checked={formData.isActive}
            onChange={(checked) => handleSwitchChange('isActive')({ target: { checked } } as any)}
            disabled={isSubmitting}
            label="Active"
          />
        </div>
      </FormContainer>
    </EpunchPage>
  );
}; 