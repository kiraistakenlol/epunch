import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebSocket } from './useWebSocket';
import { selectUserId } from '../features/auth/authSlice';
import { updatePunchCard, addPunchCard, type PunchCardWithAnimations } from '../features/punchCards/punchCardsSlice';
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
        const cardWithAnimation: PunchCardWithAnimations = { ...punchCard, animateNewPunch: true };
        dispatch(updatePunchCard(cardWithAnimation));

        if (newCard) {
          const newCardWithAnimation: PunchCardWithAnimations = { ...newCard, animateNewCard: true };
          dispatch(addPunchCard(newCardWithAnimation));
        }
      }

      if (appEvent.type === 'REWARD_CLAIMED') {
        const { card } = appEvent;
        dispatch(updatePunchCard(card));
      }
    }
  }, [events, userId, dispatch]);
}; 