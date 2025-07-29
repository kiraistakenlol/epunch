import { useRef, useState, forwardRef, ReactNode, MouseEvent } from 'react';
import styles from './BaseCard.module.css';

interface BaseCardProps {
  front: ReactNode;
  back?: ReactNode;
  onClick?: () => void;
  className?: string;
  disableFlipping?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

const BaseCard = forwardRef<HTMLDivElement, BaseCardProps>(({
  front,
  back,
  onClick,
  className = '',
  disableFlipping = false,
  backgroundColor,
  textColor
}, forwardedRef) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const cardRef = forwardedRef || internalRef;
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();

    if (onClick) {
      onClick();
    }

    if (back && !disableFlipping && !isFlipping) {
      const newFlippedState = !isFlipped;

      setIsFlipping(true);

      setTimeout(() => {
        setIsFlipped(newFlippedState);
      }, 300);

      setTimeout(() => {
        setIsFlipping(false);
      }, 700);
    }
  };

  const getCardClasses = () => {
    const classes = [styles.cardInner];
    
    if (className) {
      classes.push(className);
    }
    
    if (isFlipping) {
      classes.push(styles.flipAnimation);
    }

    return classes.join(' ');
  };

  return (
    <div
      ref={cardRef}
      className={styles.baseCardContainer}
      onClick={handleClick}
    >
      <div 
        className={getCardClasses()}
        style={{
          backgroundColor,
          color: textColor
        }}
      >
        {!isFlipped ? front : (back || front)}
      </div>
    </div>
  );
});

BaseCard.displayName = 'BaseCard';

export default BaseCard; 