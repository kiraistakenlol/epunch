import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAnimationState, AnimationStep, Wait, WaitForEvent, advanceToNextStep, setWaitingForEvent, clearReceivedEvent } from './animationSlice';
import type { AppDispatch } from '../../store/store';

export const useAnimationExecutor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const animationState = useSelector(selectAnimationState);
  const { sequence, currentStepIndex, isRunning, waitingForEvent, pendingCleanupStep, receivedEvent } = animationState;

  // Process any received events
  const processReceivedEvent = (eventName: string) => {
    // Handle automatic animation cleanup events
    if (waitingForEvent === eventName && pendingCleanupStep) {
      pendingCleanupStep.cleanup(dispatch);
      dispatch(clearReceivedEvent());
      dispatch(advanceToNextStep());
      return true;
    }
    
    // Handle explicit WaitForEvent steps
    const currentItem = sequence[currentStepIndex];
    if (currentItem instanceof WaitForEvent && currentItem.getEventName() === eventName) {
      dispatch(clearReceivedEvent());
      dispatch(advanceToNextStep());
      return true;
    }
    
    // Event doesn't match current expectations
    dispatch(clearReceivedEvent());
    return false;
  };

  // Execute the current step in the sequence
  const executeCurrentStep = () => {
    const currentItem = sequence[currentStepIndex];

    if (currentItem instanceof AnimationStep) {
      return executeAnimationStep(currentItem);
    } else if (currentItem instanceof Wait) {
      return executeWaitStep(currentItem);
    } else if (currentItem instanceof WaitForEvent) {
      return executeWaitForEventStep(currentItem);
    }
  };

  const executeAnimationStep = (step: AnimationStep) => {
    step.execute(dispatch);
    
    const eventToWaitFor = step.getWaitForEvent();
    if (eventToWaitFor) {
      dispatch(setWaitingForEvent({ eventName: eventToWaitFor, step }));
    } else {
      dispatch(advanceToNextStep());
    }
  };

  const executeWaitStep = (waitStep: Wait) => {
    const timeout = setTimeout(() => {
      dispatch(advanceToNextStep());
    }, waitStep.getDuration());

    return () => clearTimeout(timeout);
  };

  const executeWaitForEventStep = (_waitForEventStep: WaitForEvent) => {
    // Just wait - event processing handles the advancement
  };

  // Main execution flow
  useEffect(() => {
    // 1. Check if animation modal is active
    if (!isRunning || currentStepIndex >= sequence.length) {
      return;
    }

    // 2. Process any received events first
    if (receivedEvent) {
      const wasProcessed = processReceivedEvent(receivedEvent);
      if (wasProcessed) return; // Event caused advancement, let next cycle handle new step
    }

    // 3. If waiting for an event, don't execute new steps
    if (waitingForEvent) {
      return;
    }

    // 4. Execute the current step
    const cleanup = executeCurrentStep();
    return cleanup; // Return cleanup function for timeouts

  }, [sequence, currentStepIndex, isRunning, waitingForEvent, pendingCleanupStep, receivedEvent, dispatch]);
}; 