import React, { useState, useEffect, useRef } from 'react';
import styles from './MetroNavigation.module.css';

export interface MetroSection {
  id: string;
  label: string;
  elementRef?: React.RefObject<HTMLDivElement>;
}

interface MetroNavigationProps {
  sections: MetroSection[];
  className?: string;
  hideOnScroll?: boolean;
}

export const MetroNavigation: React.FC<MetroNavigationProps> = ({
  sections,
  className = '',
  hideOnScroll = false,
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const lastScrollY = useRef(0);
  const progressTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = sections.findIndex(
            (section) => section.id === entry.target.id
          );
          if (sectionIndex !== -1) {
            setCurrentSection(sectionIndex);
          }
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      if (section.elementRef?.current) {
        observer.observe(section.elementRef.current);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (hideOnScroll && !isDragging) {
        if (scrollY > lastScrollY.current && scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll, isDragging]);

  const calculateScrollPosition = (clientX: number) => {
    if (!progressTrackRef.current) return;

    const rect = progressTrackRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, relativeX / rect.width));
    
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = percentage * maxScrollY;
    
    window.scrollTo({
      top: targetScrollY,
      behavior: 'instant'
    });
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    calculateScrollPosition(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (isDragging) {
      calculateScrollPosition(clientX);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(touch.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragMove(touch.clientX);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    handleDragEnd();
  };

  // Global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  const scrollToSection = (index: number) => {
    if (isDragging) return;
    
    const section = sections[index];
    if (section.elementRef?.current) {
      section.elementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav
      className={`${styles.metroNav} ${!isVisible ? styles.hidden : ''} ${className}`}
      role="navigation"
      aria-label="Page sections navigation"
    >
      <div className={styles.container}>
        <div 
          ref={progressTrackRef}
          className={styles.progressTrack}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div 
            className={styles.progressFill}
            style={{ width: `${(currentSection / (sections.length - 1)) * 100}%` }}
          />
          
          <div className={styles.stations}>
            {sections.map((section, index) => (
              <button
                key={section.id}
                className={`${styles.station} ${
                  index === currentSection ? styles.active : ''
                } ${
                  index < currentSection ? styles.completed : ''
                }`}
                onClick={() => scrollToSection(index)}
                aria-label={`Navigate to ${section.label} section`}
                aria-current={index === currentSection ? 'step' : undefined}
                title={section.label}
              >
                <div className={styles.stationDot} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}; 