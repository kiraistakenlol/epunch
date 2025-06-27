import React, { useState } from 'react';
import { MerchantDto } from 'e-punch-common-core';
import { MerchantPageMockup } from './MerchantPageMockup';
import { MerchantActionButton } from './MerchantActionButton';
import styles from './MerchantCustomerScanResult.module.css';

interface MerchantCustomerScanResultProps {
  merchant: MerchantDto;
  className?: string;
}

export const MerchantCustomerScanResult: React.FC<MerchantCustomerScanResultProps> = ({
  className = ''
}) => {
  const [selectedProgram, setSelectedProgram] = useState<'rewards' | 'vip'>('rewards');

  const loyaltyPrograms = [
    {
      id: 'rewards' as const,
      name: '11th coffee free',
      progress: '7/10 punches'
    },
    {
      id: 'vip' as const,
      name: '7th cake free',
      progress: '2/5 punches'
    }
  ];

  return (
    <MerchantPageMockup className={className}>
      <div className={styles.scanResultHeader}>
        <h3>Select Loyalty Program</h3>
      </div>
      <div className={styles.loyaltyProgramsList}>
        {loyaltyPrograms.map((program) => (
          <div 
            key={program.id}
            className={`${styles.loyaltyProgram} ${selectedProgram === program.id ? styles.selected : ''}`}
            onClick={() => setSelectedProgram(program.id)}
          >
            <div className={styles.programInfo}>
              <span className={styles.programName}>{program.name}</span>
              <span className={styles.programProgress}>{program.progress}</span>
            </div>
            <div className={`${styles.selectedIndicator} ${selectedProgram === program.id ? styles.visible : styles.hidden}`}>
              ✓
            </div>
          </div>
        ))}
      </div>
      <MerchantActionButton>PUNCH</MerchantActionButton>
    </MerchantPageMockup>
  );
}; 