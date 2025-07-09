import { LoyaltyProgramDto } from 'e-punch-common-core';
import { LoyaltyProgram } from '../features/loyalty/loyalty.repository';
import { Merchant } from '../features/merchant/merchant.repository';
import { MerchantMapper } from './merchant.mapper';

interface LoyaltyProgramWithMerchant {
  id: string;
  name: string;
  description: string | null;
  required_punches: number;
  reward_description: string;
  is_active: boolean;
  created_at: Date;
  merchant_id: string;
  merchant_name: string;
  merchant_address: string | null;
  merchant_slug: string;
  merchant_logo_url: string | null;
  merchant_created_at: Date;
}

export class LoyaltyProgramMapper {
  static toDto(loyaltyProgram: LoyaltyProgram, merchant: Merchant): LoyaltyProgramDto {
    return {
      id: loyaltyProgram.id,
      name: loyaltyProgram.name,
      description: loyaltyProgram.description,
      requiredPunches: loyaltyProgram.required_punches,
      rewardDescription: loyaltyProgram.reward_description,
      isActive: true,
      merchant: MerchantMapper.toDto(merchant),
      createdAt: loyaltyProgram.created_at.toISOString(),
    };
  }

  static toDtoArray(loyaltyPrograms: Array<{ loyaltyProgram: LoyaltyProgram; merchant: Merchant }>): LoyaltyProgramDto[] {
    return loyaltyPrograms.map(({ loyaltyProgram, merchant }) => 
      this.toDto(loyaltyProgram, merchant)
    );
  }

  static fromJoinedQuery(row: LoyaltyProgramWithMerchant): LoyaltyProgramDto {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      requiredPunches: row.required_punches,
      rewardDescription: row.reward_description,
      isActive: row.is_active,
      merchant: {
        id: row.merchant_id,
        name: row.merchant_name,
        address: row.merchant_address || '',
        slug: row.merchant_slug,
        logoUrl: row.merchant_logo_url || '',
        createdAt: row.merchant_created_at.toISOString(),
      },
      createdAt: row.created_at.toISOString(),
    };
  }

  static fromJoinedQueryArray(rows: LoyaltyProgramWithMerchant[]): LoyaltyProgramDto[] {
    return rows.map(row => this.fromJoinedQuery(row));
  }
} 