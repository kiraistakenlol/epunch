import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { webSocketClient, WebSocketConnectionStatus, WebSocketEvent } from '../api/websocketClient';
import { selectUserId } from '../features/auth/authSlice';

export interface UseWebSocketReturn {
  connected: boolean;
  error: string | null;
  events: WebSocketEvent[];
  clearEvents: () => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const userId = useSelector(selectUserId);
  const [connectionStatus, setConnectionStatus] = useState<WebSocketConnectionStatus>({
    connected: false,
    error: null,
  });
  const [events, setEvents] = useState<WebSocketEvent[]>([]);

  const handleConnectionChange = useCallback((status: WebSocketConnectionStatus) => {
    setConnectionStatus(status);
  }, []);

  const handleEvent = useCallback((event: WebSocketEvent) => {
    setEvents(prevEvents => [...prevEvents, event]);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  useEffect(() => {
    const unsubscribeConnection = webSocketClient.onConnectionChange(handleConnectionChange);
    const unsubscribeEvents = webSocketClient.onEvent(handleEvent);

    return () => {
      unsubscribeConnection();
      unsubscribeEvents();
    };
  }, [handleConnectionChange, handleEvent]);

  // Register user with WebSocket when userId becomes available
  useEffect(() => {
    console.log('[useWebSocket] userId changed:', userId);
    if (userId) {
      console.log('[useWebSocket] Setting userId in WebSocket client:', userId);
      webSocketClient.setUserId(userId);
    }
  }, [userId]);

  return {
    connected: connectionStatus.connected,
    error: connectionStatus.error,
    events,
    clearEvents,
  };
} 