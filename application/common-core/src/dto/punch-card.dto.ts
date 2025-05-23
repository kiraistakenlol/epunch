export type PunchCardStatusDto = 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';

export interface PunchCardDto {
  id: string;
  shopName: string;
  shopAddress: string;
  currentPunches: number;
  totalPunches: number;
  status: PunchCardStatusDto;
} 