import { BenefitCardDto, PunchCardStyleDto } from 'e-punch-common-core';
import styles from './BenefitCardFront.module.css';
import layoutStyles from '../../punch-card/shared/PunchCardLayout.module.css';

interface BenefitCardFrontProps {
  id: string;
  merchant: BenefitCardDto['merchant'];
  itemName: string;
  expiresAt: string | null;
  isExpired: boolean;
  isAvailable: boolean;
  animationFlags?: {
    highlighted?: boolean;
  };
  styles?: PunchCardStyleDto;
}

const BenefitCardFront: React.FC<BenefitCardFrontProps> = ({
  merchant,
  itemName,
  expiresAt}) => {
  const getDaysUntilExpiration = () => {
    if (!expiresAt) return { text: null, days: null };
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Expired', days: diffDays };
    if (diffDays === 0) return { text: 'Expires today', days: 0 };
    if (diffDays === 1) return { text: 'Expires in 1 day', days: 1 };
    return { text: `${diffDays} day(s) left`, days: diffDays };
  };

  const expiration = getDaysUntilExpiration();

  return (
    <div 
      className={`${layoutStyles.defaultCardLayout} ${styles.frontSide}`}
    >
      <div className={`${layoutStyles.cardSection}`}>
        <div className={styles.headerSection}>
          <span className={styles.merchantName}>
            {merchant.name}
          </span>
        </div>
      </div>
      
      <div className={`${layoutStyles.cardSection}`}>
        <div className={styles.mainContent}>
          <div className={styles.itemName}>
            {itemName}
          </div>
        </div>
      </div>

      <div className={`${layoutStyles.cardSection}`}>
        <div className={styles.footerSection}>
          {expiration.text && (
            <div className={styles.expiration}>
              {expiration.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenefitCardFront;