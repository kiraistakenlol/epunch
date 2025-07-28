import { BundleDto, BundleProgramSummaryDto, PunchCardStyleDto, MerchantDto } from 'e-punch-common-core';
import { Bundle, BundleWithProgram, BundleWithProgramAndStyles } from '../features/bundle/bundle.repository';

export class BundleMapper {
  static toDto(bundleWithProgram: BundleWithProgram): BundleDto {
    const merchant: MerchantDto = {
      id: bundleWithProgram.merchant_id,
      name: bundleWithProgram.merchant_name,
      address: bundleWithProgram.merchant_address,
      slug: bundleWithProgram.merchant_slug,
      logoUrl: bundleWithProgram.merchant_logo_url,
      createdAt: bundleWithProgram.merchant_created_at.toISOString(),
    };

    const bundleProgram: BundleProgramSummaryDto = {
      id: bundleWithProgram.bundle_program_id,
      name: bundleWithProgram.program_name,
      itemName: bundleWithProgram.program_item_name,
      description: bundleWithProgram.program_description,
      merchant,
    };

    // Default empty styles if no styles are provided
    const styles: PunchCardStyleDto = {
      primaryColor: null,
      secondaryColor: null,
      logoUrl: null,
      backgroundImageUrl: null,
      punchIcons: null
    };

    return {
      id: bundleWithProgram.id,
      userId: bundleWithProgram.user_id,
      bundleProgram,
      originalQuantity: bundleWithProgram.original_quantity,
      remainingQuantity: bundleWithProgram.remaining_quantity,
      expiresAt: bundleWithProgram.expires_at?.toISOString() || null,
      createdAt: bundleWithProgram.created_at.toISOString(),
      lastUsedAt: bundleWithProgram.last_used_at?.toISOString() || null,
      styles,
    };
  }

  static toDtoWithStyles(bundleWithStyles: BundleWithProgramAndStyles): BundleDto {
    const merchant: MerchantDto = {
      id: bundleWithStyles.merchant_id,
      name: bundleWithStyles.merchant_name,
      address: bundleWithStyles.merchant_address,
      slug: bundleWithStyles.merchant_slug,
      logoUrl: bundleWithStyles.merchant_logo_url,
      createdAt: bundleWithStyles.merchant_created_at.toISOString(),
    };

    const bundleProgram: BundleProgramSummaryDto = {
      id: bundleWithStyles.bundle_program_id,
      name: bundleWithStyles.program_name,
      itemName: bundleWithStyles.program_item_name,
      description: bundleWithStyles.program_description,
      merchant,
    };

    const styles: PunchCardStyleDto = {
      primaryColor: bundleWithStyles.primary_color,
      secondaryColor: bundleWithStyles.secondary_color,
      logoUrl: bundleWithStyles.logo_url,
      backgroundImageUrl: bundleWithStyles.background_image_url,
      punchIcons: bundleWithStyles.punch_icons
    };

    return {
      id: bundleWithStyles.id,
      userId: bundleWithStyles.user_id,
      bundleProgram,
      originalQuantity: bundleWithStyles.original_quantity,
      remainingQuantity: bundleWithStyles.remaining_quantity,
      expiresAt: bundleWithStyles.expires_at?.toISOString() || null,
      createdAt: bundleWithStyles.created_at.toISOString(),
      lastUsedAt: bundleWithStyles.last_used_at?.toISOString() || null,
      styles,
    };
  }

  static toDtoArray(bundlesWithProgram: BundleWithProgram[]): BundleDto[] {
    return bundlesWithProgram.map(bundle => this.toDto(bundle));
  }

  static toDtoArrayWithStyles(bundlesWithStyles: BundleWithProgramAndStyles[]): BundleDto[] {
    return bundlesWithStyles.map(bundle => this.toDtoWithStyles(bundle));
  }
} 