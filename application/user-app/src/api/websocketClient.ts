import { io, Socket } from 'socket.io-client';

export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export interface WebSocketConnectionStatus {
  connected: boolean;
  error: string | null;
}

class WebSocketClient {
  private socket: Socket | null = null;
  private connectionCallbacks: Set<(status: WebSocketConnectionStatus) => void> = new Set();
  private eventCallbacks: Set<(event: WebSocketEvent) => void> = new Set();
  private registeredUserId: string | null = null;

  constructor() {
    this.setupConnection();
  }

  private setupConnection() {
    const apiUrl = (import.meta as any).env?.VITE_API_URL;
    // Remove /api/v1 from the URL to get the base WebSocket URL
    const backendUrl = apiUrl?.replace('/api/v1', '') || 'http://localhost:4000';
    
    console.log('[WebSocketClient] API URL:', apiUrl);
    console.log('[WebSocketClient] WebSocket URL:', backendUrl);
    
    this.socket = io(backendUrl);

    this.socket.on('connect', () => {
      console.log('[WebSocketClient] Connected to WebSocket server');
      this.notifyConnectionCallbacks({ connected: true, error: null });
      
      // If we have a userId, register it immediately
      if (this.registeredUserId) {
        this.registerUser(this.registeredUserId);
      }
    });

    this.socket.on('registration_confirmed', (data: { userId: string }) => {
      console.log('[WebSocketClient] User registration confirmed:', data.userId);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WebSocketClient] Disconnected:', reason);
      this.notifyConnectionCallbacks({ connected: false, error: reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocketClient] Connection error:', error);
      this.notifyConnectionCallbacks({ connected: false, error: error.message });
    });

    // Listen for all events (catch-all)
    this.socket.onAny((eventName, ...args) => {
      console.group(`[WebSocketClient] Received event: ${eventName}`);
      console.log('Event Type:', eventName);
      console.log('Event Data:', args);
      console.log('Timestamp:', new Date().toISOString());
      
      // Special handling for punch_event to show the nested AppEvent
      if (eventName === 'punch_event' && args[0]) {
        console.log('AppEvent Type:', args[0].type);
        console.log('AppEvent UserId:', args[0].userId);
        console.log('AppEvent Data:', args[0].data);
      }
      
      console.groupEnd();
      
      this.notifyEventCallbacks({
        type: eventName,
        data: args,
        timestamp: new Date(),
      });
    });
  }

  onConnectionChange(callback: (status: WebSocketConnectionStatus) => void): () => void {
    this.connectionCallbacks.add(callback);
    
    if (this.socket) {
      callback({ 
        connected: this.socket.connected, 
        error: null 
      });
    }

    return () => {
      this.connectionCallbacks.delete(callback);
    };
  }

  onEvent(callback: (event: WebSocketEvent) => void): () => void {
    this.eventCallbacks.add(callback);
    
    return () => {
      this.eventCallbacks.delete(callback);
    };
  }

  private notifyConnectionCallbacks(status: WebSocketConnectionStatus): void {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('[WebSocketClient] Error in connection callback:', error);
      }
    });
  }

  private notifyEventCallbacks(event: WebSocketEvent): void {
    this.eventCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('[WebSocketClient] Error in event callback:', error);
      }
    });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  setUserId(userId: string): void {
    this.registeredUserId = userId;
    
    // If already connected, register immediately
    if (this.socket?.connected) {
      this.registerUser(userId);
    }
  }

  private registerUser(userId: string): void {
    if (!this.socket?.connected) {
      console.log('[WebSocketClient] Cannot register user - not connected');
      return;
    }

    console.log('[WebSocketClient] Registering user:', userId);
    this.socket.emit('register_user', { userId });
  }
}

export const webSocketClient = new WebSocketClient(); 