import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebSocket } from './useWebSocket';
import { selectUserId } from '../features/auth/authSlice';
import { updatePunchCardWithAnimation, addPunchCardWithAnimation } from '../features/punchCards/punchCardsSlice';
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
        const { punchCard } = appEvent;
        dispatch(updatePunchCardWithAnimation(punchCard));

      } else if (appEvent.type === 'CARD_CREATED') {
        const { punchCard } = appEvent;

        if (punchCard) {
          setTimeout(() => {
            dispatch(addPunchCardWithAnimation(punchCard));
          }, 2500);
        }
      }
    }
  }, [events, userId, dispatch]);
}; 