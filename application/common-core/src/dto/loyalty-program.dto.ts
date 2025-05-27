import { MerchantDto } from './merchant.dto';

export interface LoyaltyProgramDto {
  id: string;
  name: string;
  description: string | null;
  requiredPunches: number;
  rewardDescription: string;
  isActive: boolean;
  merchant: MerchantDto;
  createdAt: string;
}

export interface CreateLoyaltyProgramDto {
  name: string;
  description?: string;
  requiredPunches: number;
  rewardDescription: string;
  isActive?: boolean;
}

export interface UpdateLoyaltyProgramDto {
  name?: string;
  description?: string;
  rewardDescription?: string;
  isActive?: boolean;
} 