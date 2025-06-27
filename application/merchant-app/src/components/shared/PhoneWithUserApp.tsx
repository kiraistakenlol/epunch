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
      const availableHeight = containerRect.height;
      
      // Calculate scale based on both width and height to prevent overflow
      const widthScale = availableWidth / 375;
      const heightScale = availableHeight / 667;
      
      // Use the smaller scale to ensure content fits properly
      let finalScale = Math.min(widthScale, heightScale);
      
      // Apply iPhone-specific adjustments
      const isiPhone = /iPhone/.test(navigator.userAgent);
      const isLargePhone = window.screen.width >= 414 || window.screen.height >= 896;
      
      if (isiPhone && isLargePhone) {
        // Add extra margin for large iPhones like iPhone 15 Pro Max
        finalScale = finalScale * 0.9;
      }
      
      // Ensure minimum scale to maintain readability
      finalScale = Math.max(finalScale, 0.3);
      // Ensure maximum scale to prevent overflow
      finalScale = Math.min(finalScale, 1.0);
      
      setScale(finalScale);
    };

    calculateScale();
    
    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen to orientation changes on mobile
    const handleOrientationChange = () => {
      setTimeout(calculateScale, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', calculateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', calculateScale);
    };
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