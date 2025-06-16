import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from 'e-punch-common-ui';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../../store/hooks';
import { EpunchCard, EpunchButon, EpunchSpinner } from '../../components/foundational';
import { LoyaltyProgramListItem } from './LoyaltyProgramListItem';
import styles from './LoyaltyProgramsList.module.css';

interface LoyaltyProgramsListProps {
  onError: (error: string) => void;
}

export const LoyaltyProgramsList: React.FC<LoyaltyProgramsListProps> = ({ onError }) => {
  const navigate = useNavigate();
  const merchantId = useAppSelector(state => state.auth.merchant?.id);
  
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLoyaltyPrograms();
  }, [merchantId]);

  const fetchLoyaltyPrograms = async () => {
    if (!merchantId) {
      onError('Merchant not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
      setLoyaltyPrograms(programs);
    } catch (err: any) {
      console.error('Failed to fetch loyalty programs:', err);
      onError(err.message || 'Failed to load loyalty programs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!merchantId) return;
    
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await apiClient.deleteLoyaltyProgram(merchantId, id);
        await fetchLoyaltyPrograms();
      } catch (err: any) {
        console.error('Failed to delete loyalty program:', err);
        onError(err.message || 'Failed to delete loyalty program');
      }
    }
  };

  const handleCreate = () => {
    navigate('/loyalty-programs/create');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <EpunchSpinner />
      </div>
    );
  }

  if (loyaltyPrograms.length === 0) {
    return (
      <EpunchCard>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No loyalty programs yet</h2>
          <p className={styles.emptyDescription}>
            Create your first loyalty program to get started
          </p>
          <EpunchButon onClick={handleCreate} className={styles.createButton}>
            + Create Program
          </EpunchButon>
        </div>
      </EpunchCard>
    );
  }

  return (
    <div className={styles.programsList}>
      {loyaltyPrograms.map((program) => (
        <LoyaltyProgramListItem
          key={program.id}
          program={program}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}; 