import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from 'e-punch-common-ui';
import { CreateLoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../store/hooks';
import { EpunchForm } from '../../components/foundational/EpunchForm';
import { EpunchInput, EpunchPage, EpunchNumberInput, EpunchSwitch } from '../../components/foundational';

export const LoyaltyProgramCreate: React.FC = () => {
  const navigate = useNavigate();
  const merchantId = useAppSelector(state => state.auth.merchant?.id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requiredPunches: 10,
    rewardDescription: '',
    isActive: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  return (
    <EpunchPage title="Create Loyalty Program" backTo="/loyalty-programs">
      <EpunchForm 
        error={submitError}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/loyalty-programs')}
        submitText="Create Program"
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
        />
      </EpunchForm>
    </EpunchPage>
  );
}; 