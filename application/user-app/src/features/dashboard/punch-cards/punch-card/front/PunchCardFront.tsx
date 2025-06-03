import React from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../../../store/hooks';
import { selectLoyaltyProgramById } from '../../../../loyaltyPrograms/loyaltyProgramsSlice';
import PunchCardFrontHeader from './header/PunchCardFrontHeader';
import PunchCardFrontBody from './body/PunchCardFrontBody';
import PunchCardFrontFooter from './footer/PunchCardFrontFooter';
import styles from './PunchCardFront.module.css';

interface PunchCardFrontProps extends Pick<PunchCardDto, 'loyaltyProgramId' | 'shopName' | 'currentPunches' | 'totalPunches' | 'status'> {
  animatedPunchIndex?: number;
  isSelected: boolean;
}

const PunchCardFront: React.FC<PunchCardFrontProps> = ({
  loyaltyProgramId,
  shopName,
  currentPunches,
  totalPunches,
  status,
  animatedPunchIndex,
  isSelected
}) => {
  const loyaltyProgram = useAppSelector(state => selectLoyaltyProgramById(state, loyaltyProgramId));

  return (
    <div className={styles.container}>
      <div className={`${styles.containerSection} ${styles.header}`}>
        <PunchCardFrontHeader
          shopName={shopName}
          status={status}
          isSelected={isSelected}
        />
      </div>
      <div className={`${styles.containerSection} ${styles.body}`}>
        <PunchCardFrontBody
          totalPunches={totalPunches}
          currentPunches={currentPunches}
          animatedPunchIndex={animatedPunchIndex}
          loyaltyProgram={loyaltyProgram}
        />
      </div>
      <div className={`${styles.containerSection} ${styles.footer}`}>
        <PunchCardFrontFooter />
      </div>
    </div>
  );
};

export default PunchCardFront; 