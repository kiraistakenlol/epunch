import { PunchCardDto } from './punch-card.dto';

// Base event interface  
export interface BaseEvent {
  type: string;
  userId: string;
}

// Specific event types
export interface PunchAddedEvent extends BaseEvent {
  type: 'PUNCH_ADDED';
  punchCard: PunchCardDto;
  newCard: PunchCardDto | null;
}

// Union type for all events
export type AppEvent = PunchAddedEvent; 