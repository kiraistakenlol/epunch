import { PunchCardDto, PunchCardStyleDto } from 'e-punch-common-core';
import { PunchCard } from '../features/punch-cards/punch-cards.repository';

export class PunchCardMapper {
  static basicToDto(
    punchCard: PunchCard, 
    merchantName: string, 
    merchantAddress: string | null, 
    requiredPunches: number,
    styles: PunchCardStyleDto
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
      styles: styles,
    };
  }
} 