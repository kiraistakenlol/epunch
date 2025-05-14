export type PunchCardStatusDto = 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';

export interface PunchCardDto {
  shopName: string;
  shopAddress: string;
  currentPunches: number;
  totalPunches: number;
  status: PunchCardStatusDto;
} 