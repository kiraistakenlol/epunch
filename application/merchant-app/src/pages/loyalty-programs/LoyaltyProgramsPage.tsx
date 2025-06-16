import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EpunchPage, EpunchButon } from '../../components/foundational';
import { LoyaltyProgramsList } from './LoyaltyProgramsList';
import { showErrorToast } from '../../utils/toast';
import styles from './LoyaltyProgramsPage.module.css';

export const LoyaltyProgramsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleError = (error: string) => {
    showErrorToast(error);
  };

  const handleCreate = () => {
    navigate('/loyalty-programs/create');
  };

  return (
    <EpunchPage title="Loyalty Programs">
      <div className={styles.pageHeader}>
        <EpunchButon onClick={handleCreate} className={styles.createButton}>
          + Create Program
        </EpunchButon>
      </div>
      
      <LoyaltyProgramsList onError={handleError} />
    </EpunchPage>
  );
}; 