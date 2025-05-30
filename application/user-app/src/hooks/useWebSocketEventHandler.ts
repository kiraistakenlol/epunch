import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebSocket } from './useWebSocket';
import { selectUserId } from '../features/auth/authSlice';
import { updatePunchCard, addPunchCard, type PunchCardState } from '../features/punchCards/punchCardsSlice';
import { startSequence } from '../features/animations/animationSlice';
import { 
  ShowPunchAnimation, 
  ShowCompletionOverlay, 
  HighlightCard, 
  ShowNewCardAnimation, 
  ShowRewardClaimedAnimation, 
  ScrollToCard 
} from '../features/animations/animationSteps';
import { Wait } from '../features/animations/animationSlice';
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
        
        dispatch(updatePunchCard(punchCard));

        if (newCard) {
          console.log('Adding new card with visible: false:', newCard);
          
          const newCardWithState: PunchCardState = { 
            ...newCard, 
            visible: false 
          };
          dispatch(addPunchCard(newCardWithState));

          const animationSequence = [
            new ScrollToCard(punchCard.id),
            new Wait(1000),
            new ShowPunchAnimation(punchCard.id, punchCard.currentPunches - 1),
            new Wait(1000),
            new ShowCompletionOverlay(punchCard.id),
            new HighlightCard(punchCard.id),
            new Wait(500),
            new ShowNewCardAnimation(newCard.id)
          ];

          console.log('Starting complex animation sequence:', animationSequence);
          dispatch(startSequence(animationSequence));
        } else {
          console.log('Starting simple animation sequence for card:', punchCard.id);
          
          const animationSequence = [
            new ScrollToCard(punchCard.id),
            new Wait(100),
            new ShowPunchAnimation(punchCard.id, punchCard.currentPunches - 1),
            new Wait(1000)
          ];

          dispatch(startSequence(animationSequence));
        }
      }

      if (appEvent.type === 'REWARD_CLAIMED') {
        const { card } = appEvent;
        
        console.log('REWARD_CLAIMED event received:', card);
        
        const animationSequence = [
          new ShowRewardClaimedAnimation(card.id)
        ];

        dispatch(startSequence(animationSequence));
      }
    }
  }, [events, userId, dispatch]);
}; 