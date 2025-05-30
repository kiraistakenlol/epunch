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
    console.log('Processing received event:', eventName);
    
    // Handle automatic animation cleanup events
    if (waitingForEvent === eventName && pendingCleanupStep) {
      console.log('→ Animation completed, running cleanup and advancing');
      pendingCleanupStep.cleanup(dispatch);
      dispatch(clearReceivedEvent());
      dispatch(advanceToNextStep());
      return true;
    }
    
    // Handle explicit WaitForEvent steps
    const currentItem = sequence[currentStepIndex];
    if (currentItem instanceof WaitForEvent && currentItem.getEventName() === eventName) {
      console.log('→ WaitForEvent condition met, advancing');
      dispatch(clearReceivedEvent());
      dispatch(advanceToNextStep());
      return true;
    }
    
    // Event doesn't match current expectations
    console.log('→ Event ignored (not expected at this time)');
    dispatch(clearReceivedEvent());
    return false;
  };

  // Execute the current step in the sequence
  const executeCurrentStep = () => {
    const currentItem = sequence[currentStepIndex];
    console.log('Executing step', currentStepIndex, ':', currentItem.constructor.name);

    if (currentItem instanceof AnimationStep) {
      return executeAnimationStep(currentItem);
    } else if (currentItem instanceof Wait) {
      return executeWaitStep(currentItem);
    } else if (currentItem instanceof WaitForEvent) {
      return executeWaitForEventStep(currentItem);
    }
  };

  const executeAnimationStep = (step: AnimationStep) => {
    console.log('→ Running animation step');
    step.execute(dispatch);
    
    const eventToWaitFor = step.getWaitForEvent();
    if (eventToWaitFor) {
      console.log(`→ Waiting for animation event: ${eventToWaitFor}`);
      dispatch(setWaitingForEvent({ eventName: eventToWaitFor, step }));
    } else {
      console.log('→ No waiting needed, advancing immediately');
      dispatch(advanceToNextStep());
    }
  };

  const executeWaitStep = (waitStep: Wait) => {
    console.log(`→ Starting wait: ${waitStep.getDuration()}ms`);
    const timeout = setTimeout(() => {
      console.log('→ Wait completed, advancing');
      dispatch(advanceToNextStep());
    }, waitStep.getDuration());

    return () => clearTimeout(timeout);
  };

  const executeWaitForEventStep = (waitForEventStep: WaitForEvent) => {
    console.log(`→ Waiting for explicit event: ${waitForEventStep.getEventName()}`);
    // Just wait - event processing handles the advancement
  };

  // Main execution flow
  useEffect(() => {
    console.log('AnimationExecutor state:', { 
      isRunning, 
      currentStepIndex, 
      sequenceLength: sequence.length,
      waitingForEvent,
      receivedEvent: receivedEvent || 'none'
    });

    // 1. Check if animation system is active
    if (!isRunning || currentStepIndex >= sequence.length) {
      if (!isRunning) console.log('❌ Animation system not running');
      if (currentStepIndex >= sequence.length) console.log('✅ Sequence completed');
      return;
    }

    // 2. Process any received events first
    if (receivedEvent) {
      const wasProcessed = processReceivedEvent(receivedEvent);
      if (wasProcessed) return; // Event caused advancement, let next cycle handle new step
    }

    // 3. If waiting for an event, don't execute new steps
    if (waitingForEvent) {
      console.log(`⏳ Waiting for event: ${waitingForEvent}`);
      return;
    }

    // 4. Execute the current step
    const cleanup = executeCurrentStep();
    return cleanup; // Return cleanup function for timeouts

  }, [sequence, currentStepIndex, isRunning, waitingForEvent, pendingCleanupStep, receivedEvent, dispatch]);
}; 