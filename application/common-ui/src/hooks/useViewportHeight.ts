import { useEffect, useState } from 'react';

export const useViewportHeight = () => {
  const [viewportHeight, setViewportHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight;
    }
    return 0;
  });

  useEffect(() => {
    const updateViewportHeight = () => {
      const height = window.innerHeight;
      setViewportHeight(height);
      
      // Set CSS custom property for older browsers that don't support dvh
      document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
    };

    const throttledUpdate = (() => {
      let timeoutId: number;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(updateViewportHeight, 100);
      };
    })();

    // Set initial value
    updateViewportHeight();

    // Listen for resize events (includes orientation changes and browser UI changes)
    window.addEventListener('resize', throttledUpdate);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewportHeight, 100);
    });

    // Special handling for mobile Safari
    if ('visualViewport' in window) {
      const visualViewport = window.visualViewport!;
      const handleVisualViewportChange = () => {
        const height = visualViewport.height;
        setViewportHeight(height);
        document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
      };
      
      visualViewport.addEventListener('resize', handleVisualViewportChange);
      
      return () => {
        window.removeEventListener('resize', throttledUpdate);
        window.removeEventListener('orientationchange', updateViewportHeight);
        visualViewport.removeEventListener('resize', handleVisualViewportChange);
      };
    }

    return () => {
      window.removeEventListener('resize', throttledUpdate);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  return viewportHeight;
}; 