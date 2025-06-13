import { PunchCardStyleDto } from './punch-card-style.dto';

export type PunchCardStatusDto = 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';

export interface PunchCardDto {
  id: string;
  loyaltyProgramId: string;
  shopName: string;
  shopAddress: string;
  currentPunches: number;
  totalPunches: number;
  status: PunchCardStatusDto;
  createdAt: string; // ISO string format
  styles: PunchCardStyleDto;
}

export interface CreatePunchCardDto {
  userId: string;
  loyaltyProgramId: string;
} 