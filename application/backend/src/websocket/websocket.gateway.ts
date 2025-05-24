import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { EventService } from '../events/event.service';
import { AppEvent } from 'e-punch-common-core';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private readonly userSockets = new Map<string, Set<string>>(); // userId -> Set of socketIds

  constructor(private readonly eventService: EventService) {
    this.setupEventListeners();
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.log(`Total connected clients: ${this.server.engine.clientsCount}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.removeSocketFromUser(client.id);
  }

  @SubscribeMessage('register_user')
  handleUserRegistration(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
    if (!data.userId) {
      this.logger.warn(`Client ${client.id} attempted to register without userId`);
      return;
    }

    this.logger.log(`Registering client ${client.id} for user ${data.userId}`);
    this.addSocketToUser(data.userId, client.id);
    
    client.emit('registration_confirmed', { userId: data.userId });
  }

  @SubscribeMessage('test')
  handleTestEvent(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.logger.log(`Test event received:`, data);
    
    // Emit a test event back to the client
    client.emit('test_response', {
      message: 'Hello from WebSocket server!',
      timestamp: new Date().toISOString(),
      originalData: data,
    });
  }

  private setupEventListeners() {
    this.eventService.on('PUNCH_ADDED', (event: AppEvent) => {
      this.broadcastToUser(event);
    });

    this.eventService.on('CARD_CREATED', (event: AppEvent) => {
      this.broadcastToUser(event);
    });
  }

  private addSocketToUser(userId: string, socketId: string): void {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
  }

  private removeSocketFromUser(socketId: string): void {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(socketId)) {
        sockets.delete(socketId);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        this.logger.log(`Removed socket ${socketId} from user ${userId}`);
        break;
      }
    }
  }

  private broadcastToUser(event: AppEvent): void {
    const userId = event.userId;
    const userSockets = this.userSockets.get(userId);
    
    if (!userSockets || userSockets.size === 0) {
      this.logger.log(`No connected sockets for user ${userId}, skipping event ${event.type}`);
      this.logger.log(`Currently registered users: ${Array.from(this.userSockets.keys()).join(', ')}`);
      return;
    }

    this.logger.log(`Broadcasting ${event.type} event to ${userSockets.size} socket(s) for user ${userId}`);
    
    for (const socketId of userSockets) {
      this.server.to(socketId).emit('punch_event', event);
    }
  }
} 