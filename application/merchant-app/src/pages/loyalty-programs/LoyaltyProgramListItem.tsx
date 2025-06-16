import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { EpunchCard, EpunchButon } from '../../components/foundational';
import styles from './LoyaltyProgramListItem.module.css';

interface LoyaltyProgramListItemProps {
  program: LoyaltyProgramDto;
  onDelete: (id: string, name: string) => void;
}

export const LoyaltyProgramListItem: React.FC<LoyaltyProgramListItemProps> = ({ 
  program, 
  onDelete 
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/loyalty-programs/${program.id}/edit`);
  };

  const handleDelete = () => {
    onDelete(program.id, program.name);
  };

  return (
    <EpunchCard>
      <div className={styles.programCard}>
        <div className={styles.programHeader}>
          <h3 className={styles.programName}>{program.name}</h3>
          <span className={`${styles.statusBadge} ${program.isActive ? styles.statusActive : styles.statusInactive}`}>
            {program.isActive ? '● Active' : '○ Inactive'}
          </span>
        </div>
        
        <div className={styles.programDetails}>
          <p className={styles.programRequirement}>
            {program.requiredPunches} punches → {program.rewardDescription}
          </p>

          {program.description && (
            <p className={styles.programDescription}>
              {program.description}
            </p>
          )}
        </div>
        
        <div className={styles.programActions}>
          <EpunchButon onClick={handleEdit} className={styles.editButton}>
            Edit
          </EpunchButon>
          
          <EpunchButon onClick={handleDelete} className={styles.deleteButton}>
            Delete
          </EpunchButon>
        </div>
      </div>
    </EpunchCard>
  );
}; 