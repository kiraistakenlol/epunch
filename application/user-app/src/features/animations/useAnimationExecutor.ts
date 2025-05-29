import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAnimationState, AnimationStep, Delay, WaitForEvent, advanceToNextStep } from './animationSlice';
import type { AppDispatch } from '../../store/store';

export const useAnimationExecutor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sequence, currentStepIndex, isRunning } = useSelector(selectAnimationState);

  useEffect(() => {
    console.log('AnimationExecutor state changed:', { 
      isRunning, 
      currentStepIndex, 
      sequenceLength: sequence.length,
      currentItem: sequence[currentStepIndex] 
    });

    if (!isRunning || currentStepIndex >= sequence.length) {
      if (!isRunning) console.log('Animation not running');
      if (currentStepIndex >= sequence.length) console.log('Reached end of sequence');
      return;
    }

    const currentItem = sequence[currentStepIndex];
    console.log('Executing step', currentStepIndex, ':', currentItem);

    if (currentItem instanceof AnimationStep) {
      console.log('Executing AnimationStep:', currentItem.constructor.name);
      currentItem.execute(dispatch);
    } else if (currentItem instanceof Delay) {
      console.log('Executing Delay:', currentItem.getDuration(), 'ms');
      const timeout = setTimeout(() => {
        console.log('Delay completed, advancing to next step');
        dispatch(advanceToNextStep());
      }, currentItem.getDuration());

      return () => clearTimeout(timeout);
    } else if (currentItem instanceof WaitForEvent) {
      console.log(`Waiting for event: ${currentItem.getEventName()}`);
    }
  }, [sequence, currentStepIndex, isRunning, dispatch]);
}; 