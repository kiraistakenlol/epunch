import { PunchCardStyleDto } from './punch-card-style.dto';

export type PunchCardStatusDto = 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';

export interface PunchCardDto {
  id: string;
  loyaltyProgramId: string;
  loyaltyProgramName?: string;
  loyaltyProgramDescription?: string;
  rewardDescription?: string;
  shopName: string;
  shopAddress: string;
  currentPunches: number;
  totalPunches: number;
  status: PunchCardStatusDto;
  createdAt: string; // ISO string format
  completedAt: string | null; // ISO string format
  redeemedAt: string | null; // ISO string format
  lastPunchAt: string | null; // ISO string format
  styles: PunchCardStyleDto;
}

export interface CreatePunchCardDto {
  userId: string;
  loyaltyProgramId: string;
} 