import { useEffect, useState } from 'react';

export const useViewportHeight = () => {
  const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const updateViewportHeight = () => {
      const height = window.innerHeight;
      setViewportHeight(height);
      
      // Set CSS custom property for older browsers that don't support dvh
      document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
    };

    // Set initial value
    updateViewportHeight();

    // Listen for resize events (includes orientation changes and browser UI changes)
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    // Special handling for mobile Safari
    if ('visualViewport' in window) {
      const visualViewport = window.visualViewport!;
      const handleVisualViewportChange = () => {
        setViewportHeight(visualViewport.height);
        document.documentElement.style.setProperty('--vh', `${visualViewport.height * 0.01}px`);
      };
      
      visualViewport.addEventListener('resize', handleVisualViewportChange);
      
      return () => {
        window.removeEventListener('resize', updateViewportHeight);
        window.removeEventListener('orientationchange', updateViewportHeight);
        visualViewport.removeEventListener('resize', handleVisualViewportChange);
      };
    }

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  return viewportHeight;
}; 