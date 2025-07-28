import React from 'react';
import { PunchCardDto, PunchCardStyleDto } from 'e-punch-common-core';
import { appColors } from 'e-punch-common-ui';
import { useAppSelector } from '../../../../../store/hooks';
import { selectLoyaltyProgramById } from '../../../../loyaltyPrograms/loyaltyProgramsSlice';
import { resolveCardStyles } from '../../../../../utils/cardStyles';
import PunchCardFrontHeader from './header/PunchCardFrontHeader';
import PunchCardFrontBody from './body/PunchCardFrontBody';
import styles from './PunchCardFront.module.css';
import layoutStyles from '../shared/PunchCardLayout.module.css';

interface PunchCardFrontProps extends Pick<PunchCardDto, 'loyaltyProgramId' | 'shopName' | 'currentPunches' | 'totalPunches' | 'status'> {
  cardStyles: PunchCardStyleDto;
  animatedPunchIndex?: number;
}

const PunchCardFront: React.FC<PunchCardFrontProps> = ({
  loyaltyProgramId,
  shopName,
  currentPunches,
  totalPunches,
  status,
  cardStyles,
  animatedPunchIndex
}) => {
  const loyaltyProgram = useAppSelector(state => selectLoyaltyProgramById(state, loyaltyProgramId));
  const primaryColor = cardStyles?.primaryColor || appColors.epunchGray;
  const secondaryColor = cardStyles?.secondaryColor || appColors.epunchBlack;
  const resolvedStyles = resolveCardStyles(cardStyles); // Still need for punch icons

  return (
    <div 
      className={`${layoutStyles.defaultCardLayout} ${styles.frontSide}`}
      style={{ backgroundColor: primaryColor }}
    >
      <div className={`${layoutStyles.cardSection}`}>
        <PunchCardFrontHeader
          shopName={shopName}
          status={status}
          secondaryColor={secondaryColor}
        />
      </div>
      <div className={`${layoutStyles.cardSection}`}>
        <PunchCardFrontBody
          totalPunches={totalPunches}
          currentPunches={currentPunches}
          animatedPunchIndex={animatedPunchIndex}
          loyaltyProgram={loyaltyProgram}
          secondaryColor={secondaryColor}
          punchIcons={resolvedStyles.punchIcons}
        />
      </div>
      <div className={`${layoutStyles.cardSection}`}>
      </div>
    </div>
  );
};

export default PunchCardFront; 