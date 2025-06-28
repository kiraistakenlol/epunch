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
  const lastScrollY = useRef(0);

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

      if (hideOnScroll) {
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
  }, [hideOnScroll]);

  const scrollToSection = (index: number) => {
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
        <div className={styles.progressTrack}>
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