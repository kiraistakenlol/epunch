import { PunchCardDto, PunchCardStyleDto } from 'e-punch-common-core';
import { PunchCard, PunchCardDetails } from '../features/punch-cards/punch-cards.repository';

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
      completedAt: punchCard.completed_at ? punchCard.completed_at.toISOString() : null,
      redeemedAt: punchCard.redeemed_at ? punchCard.redeemed_at.toISOString() : null,
      lastPunchAt: punchCard.last_punch_at ? punchCard.last_punch_at.toISOString() : null,
      styles: styles,
    };
  }

  static detailToDto(detail: PunchCardDetails): PunchCardDto {
    return {
      id: detail.id,
      loyaltyProgramId: detail.loyalty_program_id,
      shopName: detail.merchant_name,
      shopAddress: detail.merchant_address || '',
      currentPunches: detail.current_punches,
      totalPunches: detail.required_punches,
      status: detail.status,
      styles: {
        primaryColor: detail.primary_color,
        secondaryColor: detail.secondary_color,
        logoUrl: detail.logo_url,
        backgroundImageUrl: detail.background_image_url,
        punchIcons: detail.punch_icons,
      },
      createdAt: detail.created_at.toISOString(),
      completedAt: detail.completed_at ? detail.completed_at.toISOString() : null,
      redeemedAt: detail.redeemed_at ? detail.redeemed_at.toISOString() : null,
      lastPunchAt: detail.last_punch_at ? detail.last_punch_at.toISOString() : null,
    };
  }
} 