import React from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../../../store/hooks';
import { selectLoyaltyProgramById } from '../../../../loyaltyPrograms/loyaltyProgramsSlice';
import PunchCardFrontHeader from './header/PunchCardFrontHeader';
import PunchCardFrontBody from './body/PunchCardFrontBody';
import PunchCardFrontFooter from './footer/PunchCardFrontFooter';
import styles from './PunchCardFront.module.css';
import layoutStyles from '../shared/PunchCardLayout.module.css';

interface PunchCardFrontProps extends Pick<PunchCardDto, 'loyaltyProgramId' | 'shopName' | 'currentPunches' | 'totalPunches' | 'status' | 'styles'> {
  animatedPunchIndex?: number;
  isSelected: boolean;
}

const PunchCardFront: React.FC<PunchCardFrontProps> = ({
  loyaltyProgramId,
  shopName,
  currentPunches,
  totalPunches,
  status,
  styles: cardStyles,
  animatedPunchIndex,
  isSelected
}) => {
  const loyaltyProgram = useAppSelector(state => selectLoyaltyProgramById(state, loyaltyProgramId));

  return (
    <div className={`${layoutStyles.defaultCardLayout} ${styles.frontSide}`}>
      <div className={`${layoutStyles.cardSection}`}>
        <PunchCardFrontHeader
          shopName={shopName}
          status={status}
          isSelected={isSelected}
        />
      </div>
      <div className={`${layoutStyles.cardSection}`}>
        <PunchCardFrontBody
          totalPunches={totalPunches}
          currentPunches={currentPunches}
          animatedPunchIndex={animatedPunchIndex}
          loyaltyProgram={loyaltyProgram}
        />
      </div>
      <div className={`${layoutStyles.cardSection}`}>
        <PunchCardFrontFooter logoUrl={cardStyles?.logoUrl} />
      </div>
    </div>
  );
};

export default PunchCardFront; 