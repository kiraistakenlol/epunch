import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebSocket } from './useWebSocket';
import { selectUserId } from '../features/auth/authSlice';
import { updatePunchCard, addPunchCard, type PunchCardState } from '../features/punchCards/punchCardsSlice';
import { startSequence } from '../features/animations/animationSlice';
import { ShowPunchAnimation, ShowCompletionOverlay, HighlightCard, ShowNewCardAnimation, ShowRewardClaimedAnimation } from '../features/animations/animationSteps';
import { Delay, WaitForEvent } from '../features/animations/animationSlice';
import { AppEvent } from 'e-punch-common-core';
import type { AppDispatch } from '../store/store';

export const useWebSocketEventHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectUserId);
  const { events } = useWebSocket();

  useEffect(() => {
    if (!userId || events.length === 0) return;

    const latestEvent = events[events.length - 1];

    if (latestEvent.type === 'punch_event' && latestEvent.data && latestEvent.data[0]) {
      const appEvent = latestEvent.data[0] as AppEvent;

      if (appEvent.userId !== userId) return;

      if (appEvent.type === 'PUNCH_ADDED') {
        const { punchCard, newCard } = appEvent;
        
        console.log('PUNCH_ADDED event received:', { punchCard, newCard });
        
        // Update punch card data
        dispatch(updatePunchCard(punchCard));

        if (newCard) {
          console.log('Adding new card with visible: false:', newCard);
          
          // Add new card but make it invisible initially
          const newCardWithState: PunchCardState = { 
            ...newCard, 
            visible: false 
          };
          dispatch(addPunchCard(newCardWithState));

          // Start complex animation sequence
          const animationSequence = [
            new ShowPunchAnimation(punchCard.id, punchCard.currentPunches - 1),
            new ShowCompletionOverlay(punchCard.id),
            new WaitForEvent('COMPLETION_OVERLAY_CLOSED'),
            new HighlightCard(punchCard.id),
            new Delay(500),
            new ShowNewCardAnimation(newCard.id)
          ];

          console.log('Starting complex animation sequence:', animationSequence);
          dispatch(startSequence(animationSequence));
        } else {
          console.log('Starting simple animation sequence for card:', punchCard.id);
          
          // Start simple animation sequence
          const animationSequence = [
            new ShowPunchAnimation(punchCard.id, punchCard.currentPunches - 1)
          ];

          dispatch(startSequence(animationSequence));
        }
      }

      if (appEvent.type === 'REWARD_CLAIMED') {
        const { card } = appEvent;
        
        console.log('REWARD_CLAIMED event received:', card);
        
        // Update card data
        dispatch(updatePunchCard(card));

        // Start reward claimed animation sequence
        const animationSequence = [
          new ShowRewardClaimedAnimation(card.id)
        ];

        dispatch(startSequence(animationSequence));
      }
    }
  }, [events, userId, dispatch]);
}; 