import { Module } from '@nestjs/common';
import { EventsGateway } from './websocket.gateway';
import { EventService } from '../events/event.service';

@Module({
  providers: [EventsGateway, EventService],
  exports: [EventService],
})
export class WebSocketModule {} 