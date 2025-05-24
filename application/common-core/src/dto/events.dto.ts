import { PunchCardStatusDto, PunchCardDto } from './punch-card.dto';

// Base event interface  
export interface BaseEvent {
  type: string;
  userId: string;
}

// Specific event types
export interface PunchAddedEvent extends BaseEvent {
  type: 'PUNCH_ADDED';
  punchCard: PunchCardDto;
}

export interface CardCreatedEvent extends BaseEvent {
  type: 'CARD_CREATED';
  punchCard: PunchCardDto;
}

// Union type for all events
export type AppEvent = PunchAddedEvent | CardCreatedEvent; 