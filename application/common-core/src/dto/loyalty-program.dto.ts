import { MerchantDto } from './merchant.dto';

export interface LoyaltyProgramDto {
  id: string;
  name: string;
  description: string | null;
  requiredPunches: number;
  rewardDescription: string;
  merchant: MerchantDto;
  createdAt: string;
} 