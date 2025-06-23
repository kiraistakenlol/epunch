import React from 'react';
import { PunchCardDto } from 'e-punch-common-core';
import { useAppSelector } from '../../../../../store/hooks';
import { selectLoyaltyProgramById } from '../../../../loyaltyPrograms/loyaltyProgramsSlice';
import { CustomizableCardStyles } from '../../../../../utils/cardStyles';
import PunchCardFrontHeader from './header/PunchCardFrontHeader';
import PunchCardFrontBody from './body/PunchCardFrontBody';
import PunchCardFrontFooter from './footer/PunchCardFrontFooter';
import styles from './PunchCardFront.module.css';
import layoutStyles from '../shared/PunchCardLayout.module.css';

interface PunchCardFrontProps extends Pick<PunchCardDto, 'loyaltyProgramId' | 'shopName' | 'currentPunches' | 'totalPunches' | 'status'> {
  resolvedStyles: CustomizableCardStyles;
  animatedPunchIndex?: number;
  isSelected: boolean;
}

const PunchCardFront: React.FC<PunchCardFrontProps> = ({
  loyaltyProgramId,
  shopName,
  currentPunches,
  totalPunches,
  status,
  resolvedStyles,
  animatedPunchIndex,
  isSelected
}) => {
  const loyaltyProgram = useAppSelector(state => selectLoyaltyProgramById(state, loyaltyProgramId));

  return (
    <div 
      className={`${layoutStyles.defaultCardLayout} ${styles.frontSide}`}
      style={{ backgroundColor: resolvedStyles.colors.frontBodyBg }}
    >
      <div className={`${layoutStyles.cardSection}`}>
        <PunchCardFrontHeader
          shopName={shopName}
          status={status}
          isSelected={isSelected}
          colors={resolvedStyles.colors}
        />
      </div>
      <div className={`${layoutStyles.cardSection}`}>
        <PunchCardFrontBody
          totalPunches={totalPunches}
          currentPunches={currentPunches}
          animatedPunchIndex={animatedPunchIndex}
          loyaltyProgram={loyaltyProgram}
          resolvedStyles={resolvedStyles}
        />
      </div>
      <div className={`${layoutStyles.cardSection}`}>
        <PunchCardFrontFooter logoUrl={resolvedStyles.logoUrl} />
      </div>
    </div>
  );
};

export default PunchCardFront; 