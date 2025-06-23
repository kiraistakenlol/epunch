import { PunchCardDto } from './punch-card.dto';

// Base event interface  
export interface BaseEvent {
  type: string;
  userId: string;
}

// Specific event types
export interface PunchAddedEvent extends BaseEvent {
  type: 'PUNCH_ADDED';
  card: PunchCardDto;
  newCard: PunchCardDto | null;
}

export interface RewardClaimedEvent extends BaseEvent {
  type: 'REWARD_CLAIMED';
  card: PunchCardDto;
}

// Union type for all events
export type AppEvent = PunchAddedEvent | RewardClaimedEvent; 