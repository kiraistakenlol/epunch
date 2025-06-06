import { PunchCardDto } from 'e-punch-common-core';
import { PunchCard } from '../features/punch-cards/punch-cards.repository';

export interface PunchCardWithDetails extends PunchCard {
  merchant_name: string;
  merchant_address: string | null;
  required_punches: number;
}

export class PunchCardMapper {
  static toDto(punchCard: PunchCardWithDetails): PunchCardDto {
    return {
      id: punchCard.id,
      loyaltyProgramId: punchCard.loyalty_program_id,
      shopName: punchCard.merchant_name,
      shopAddress: punchCard.merchant_address || '',
      currentPunches: punchCard.current_punches,
      totalPunches: punchCard.required_punches,
      status: punchCard.status,
      createdAt: punchCard.created_at.toISOString(),
    };
  }

  static toDtoArray(punchCards: PunchCardWithDetails[]): PunchCardDto[] {
    return punchCards.map(punchCard => this.toDto(punchCard));
  }

  static basicToDto(
    punchCard: PunchCard, 
    merchantName: string, 
    merchantAddress: string | null, 
    requiredPunches: number
  ): PunchCardDto {
    return {
      id: punchCard.id,
      loyaltyProgramId: punchCard.loyalty_program_id,
      shopName: merchantName,
      shopAddress: merchantAddress || '',
      currentPunches: punchCard.current_punches,
      totalPunches: requiredPunches,
      status: punchCard.status,
      createdAt: punchCard.created_at.toISOString(),
    };
  }
} 