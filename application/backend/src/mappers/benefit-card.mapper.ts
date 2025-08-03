import { BenefitCardDto, PunchCardStyleDto } from 'e-punch-common-core';
import { BenefitCardWithMerchant } from '../features/benefit-card/benefit-card.repository';
import { MerchantMapper } from './merchant.mapper';

export class BenefitCardMapper {

  static toDto(benefitCard: BenefitCardWithMerchant): BenefitCardDto {
    const merchant = MerchantMapper.toDto(benefitCard.merchant);

    const styles: PunchCardStyleDto = {
      primaryColor: benefitCard.styles.primary_color,
      secondaryColor: benefitCard.styles.secondary_color,
      logoUrl: benefitCard.styles.logo_url,
      punchIcons: benefitCard.styles.punch_icons
    };

    return {
      id: benefitCard.id,
      userId: benefitCard.user_id,
      merchant,
      itemName: benefitCard.item_name,
      expiresAt: benefitCard.expires_at?.toISOString() || null,
      createdAt: benefitCard.created_at.toISOString(),
      styles,
    };
  }

  static toDtoArray(benefitCardsWithMerchant: BenefitCardWithMerchant[]): BenefitCardDto[] {
    return benefitCardsWithMerchant.map(benefitCard => this.toDto(benefitCard));
  }
}