import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from 'e-punch-common-ui';
import { CreateLoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../store/hooks';
import { EpunchPage, FormContainer, FormField, useFormState, EpunchSwitch } from '../../components/foundational';
import styles from './LoyaltyProgramCreate.module.css';

interface LoyaltyProgramFormData {
  name: string;
  description: string;
  requiredPunches: number;
  rewardDescription: string;
  isActive: boolean;
}

export const LoyaltyProgramCreate: React.FC = () => {
  const navigate = useNavigate();
  const merchantId = useAppSelector(state => state.auth.merchant?.id);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { formData, errors, handleFieldChange, handleNumberChange, handleSwitchChange, validateForm } = useFormState<LoyaltyProgramFormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !merchantId) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const createData: CreateLoyaltyProgramDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        requiredPunches: formData.requiredPunches,
        rewardDescription: formData.rewardDescription.trim(),
        isActive: formData.isActive,
      };
      
      await apiClient.createLoyaltyProgram(merchantId, createData);
      navigate('/loyalty-programs');
    } catch (err: any) {
      console.error('Failed to create loyalty program:', err);
      setSubmitError(err.message || 'Failed to create loyalty program');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EpunchPage title="Create Loyalty Program">
      <FormContainer
        onSubmit={handleSubmit}
        onCancel={() => navigate('/loyalty-programs')}
        submitText="Create Program"
        submittingText="Creating..."
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