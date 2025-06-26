import React, { useRef, useEffect, useState } from 'react';
import styles from './PhoneWithUserApp.module.css';

interface PhoneWithUserAppProps {
  src: string;
  loading?: 'lazy' | 'eager';
  className?: string;
}

export const PhoneWithUserApp: React.FC<PhoneWithUserAppProps> = ({
  src,
  loading = 'lazy',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  
  const frameClasses = [styles.phoneFrame, className].filter(Boolean).join(' ');

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const availableWidth = containerRect.width;
      const finalScale = availableWidth / 375;
      
      setScale(finalScale);
    };

    calculateScale();
    
    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className={frameClasses}>
      <div ref={containerRef} className={styles.iframeContainer}>
        <iframe
          src={src}
          className={styles.iframe}
          loading={loading}
          style={{
            width: '375px',
            height: '667px',
            transform: `translate(-50%, -50%) scale(${scale})`
          }}
        />
      </div>
    </div>
  );
}; 