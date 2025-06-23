import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { handleEvent } from '../features/animations/animationSlice';

export const useGlobalAnimationEvents = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleAnimationEnd = (e: AnimationEvent) => {
      // Map animation names to their corresponding events
      if (e.animationName.includes('scaleUpAndBackToNormal')) {
        dispatch(handleEvent('HIGHLIGHT_ANIMATION_COMPLETE'));
      }
    };

    // Listen on document to catch all animation events
    document.addEventListener('animationend', handleAnimationEnd, true);

    return () => {
      document.removeEventListener('animationend', handleAnimationEnd, true);
    };
  }, [dispatch]);
}; 