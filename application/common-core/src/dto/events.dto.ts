import { PunchCardDto } from './punch-card.dto';
import { BundleDto } from './bundle.dto';
import { BenefitCardDto } from './benefit-card.dto';

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

export interface BundleCreatedEvent extends BaseEvent {
  type: 'BUNDLE_CREATED';
  bundle: BundleDto;
}

export interface BundleUsedEvent extends BaseEvent {
  type: 'BUNDLE_USED';
  bundle: BundleDto;
  quantityUsed: number;
}

export interface BenefitCardCreatedEvent extends BaseEvent {
  type: 'BENEFIT_CARD_CREATED';
  benefitCard: BenefitCardDto;
}

// Union type for all events
export type AppEvent = PunchAddedEvent | RewardClaimedEvent | BundleCreatedEvent | BundleUsedEvent | BenefitCardCreatedEvent; 