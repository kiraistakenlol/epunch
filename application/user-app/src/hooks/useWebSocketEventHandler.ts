import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebSocket } from './useWebSocket';
import { selectUserId } from '../features/auth/authSlice';
import { updatePunchCard } from '../features/punchCards/punchCardsSlice';
import { startSequence } from '../features/animations/animationSlice';
import { 
  ShowPunchAnimation, 
  ShowCompletionOverlay, 
  HighlightCard, 
  ScrollToCard,
  AddNewCard} from '../features/animations/animationSteps';
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
        const { card, newCard } = appEvent;
        
        dispatch(updatePunchCard(card));

        if (newCard) {
          const animationSequence = [
            new ScrollToCard(card.id),
            new ShowPunchAnimation(card.id, card.currentPunches - 1),
            new ShowCompletionOverlay(card.id),
            new HighlightCard(card.id),
            new AddNewCard(newCard)
          ];

          dispatch(startSequence(animationSequence));
        } else {
          const animationSequence = [
            new ScrollToCard(card.id),
            new ShowPunchAnimation(card.id, card.currentPunches - 1)
          ];

          dispatch(startSequence(animationSequence));
        }
      }

      if (appEvent.type === 'REWARD_CLAIMED') {
        const { card } = appEvent;
        
        dispatch(updatePunchCard(card));
      }
    }
  }, [events, userId, dispatch]);
}; 