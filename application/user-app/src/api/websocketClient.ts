import { io, Socket } from 'socket.io-client';
import { config } from '../config/env';

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
  private isInitialized: boolean = false;

  constructor() {
    
  }

  private ensureConnection() {
    if (!this.isInitialized) {
      this.setupConnection();
      this.isInitialized = true;
    }
  }

  private setupConnection() {
    // Remove /api/v1 from the URL to get the base WebSocket URL
    const backendUrl = config.api.baseUrl.replace('/api/v1', '') || 'http://localhost:4000';
    
    this.socket = io(backendUrl);

    this.socket.on('connect', () => {
      this.notifyConnectionCallbacks({ connected: true, error: null });
      
      // If we have a userId, register it immediately
      if (this.registeredUserId) {
        this.registerUser(this.registeredUserId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      this.notifyConnectionCallbacks({ connected: false, error: reason });
    });

    this.socket.on('connect_error', (error) => {
      this.notifyConnectionCallbacks({ connected: false, error: error.message });
    });

    // Listen for all events (catch-all)
    this.socket.onAny((eventName, ...args) => {
      this.notifyEventCallbacks({
        type: eventName,
        data: args,
        timestamp: new Date(),
      });
    });
  }

  onConnectionChange(callback: (status: WebSocketConnectionStatus) => void): () => void {
    this.ensureConnection();
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
    this.ensureConnection();
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
    if (!this.isInitialized) {
      return false;
    }
    return this.socket?.connected || false;
  }

  setUserId(userId: string): void {
    this.ensureConnection();
    this.registeredUserId = userId;
    
    // If already connected, register immediately
    if (this.socket?.connected) {
      this.registerUser(userId);
    }
  }

  private registerUser(userId: string): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('register_user', { userId });
  }
}

export const webSocketClient = new WebSocketClient(); 