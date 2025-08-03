import { MerchantDto } from './merchant.dto';
import { PunchCardStyleDto } from './punch-card-style.dto';

export interface BenefitCardDto {
  id: string;
  userId: string;
  merchant: MerchantDto;
  itemName: string;
  expiresAt: string | null;
  createdAt: string;
  styles: PunchCardStyleDto;
}

export interface BenefitCardCreateDto {
  userId: string;
  merchantId: string;
  itemName: string;
  expiresAt?: string; // ISO string
}