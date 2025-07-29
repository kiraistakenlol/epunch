import { BundleDto, PunchCardStyleDto } from 'e-punch-common-core';
import { BundleWithMerchant, BundleWithMerchantAndStyles } from '../features/bundle/bundle.repository';
import { MerchantMapper } from './merchant.mapper';

export class BundleMapper {
  static toDtoFromBundleWithMerchant(bundle: BundleWithMerchant): BundleDto {
    const merchant = MerchantMapper.toDto(bundle.merchant);

    const styles: PunchCardStyleDto = {
      primaryColor: null,
      secondaryColor: null,
      logoUrl: null,
      punchIcons: null
    };

    return {
      id: bundle.id,
      userId: bundle.user_id,
      itemName: bundle.item_name,
      description: bundle.description,
      merchant,
      originalQuantity: bundle.original_quantity,
      remainingQuantity: bundle.remaining_quantity,
      expiresAt: bundle.expires_at?.toISOString() || null,
      createdAt: bundle.created_at.toISOString(),
      lastUsedAt: bundle.last_used_at?.toISOString() || null,
      bundleProgramId: bundle.bundle_program_id,
      styles,
    };
  }

  static toDtoWithStyles(bundle: BundleWithMerchantAndStyles): BundleDto {
    const merchant = MerchantMapper.toDto(bundle.merchant);

    const styles: PunchCardStyleDto = {
      primaryColor: bundle.styles.primary_color,
      secondaryColor: bundle.styles.secondary_color,
      logoUrl: bundle.styles.logo_url,
      punchIcons: bundle.styles.punch_icons
    };

    return {
      id: bundle.id,
      userId: bundle.user_id,
      itemName: bundle.item_name,
      description: bundle.description,
      merchant,
      originalQuantity: bundle.original_quantity,
      remainingQuantity: bundle.remaining_quantity,
      expiresAt: bundle.expires_at?.toISOString() || null,
      createdAt: bundle.created_at.toISOString(),
      lastUsedAt: bundle.last_used_at?.toISOString() || null,
      bundleProgramId: bundle.bundle_program_id,
      styles,
    };
  }

  static toDtoArrayWithStyles(bundlesWithStyles: BundleWithMerchantAndStyles[]): BundleDto[] {
    return bundlesWithStyles.map(bundle => this.toDtoWithStyles(bundle));
  }
} 