import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { AppEvent } from 'e-punch-common-core';

@Injectable()
export class EventService extends EventEmitter {
  
  emitAppEvent<T extends AppEvent>(event: T): boolean {
    console.log(`[EventService] Emitting event: ${event.type} for user: ${event.userId}`);
    return super.emit(event.type, event);
  }
} 