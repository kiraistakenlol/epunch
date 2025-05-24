import { PunchCardStatusDto, PunchCardDto } from './punch-card.dto';

// Base event interface  
export interface BaseEvent {
  type: string;
  userId: string;
  data: {
    [key: string]: any;
  };
}

// Specific event types
export interface PunchAddedEvent extends BaseEvent {
  type: 'PUNCH_ADDED';
  data: {
    punchCardId: string;
    punchCardStatus: PunchCardStatusDto;
  };
}

export interface CardCreatedEvent extends BaseEvent {
  type: 'CARD_CREATED';
  data: {
    punchCard: PunchCardDto;
  };
}

// Union type for all events
export type AppEvent = PunchAddedEvent | CardCreatedEvent; 