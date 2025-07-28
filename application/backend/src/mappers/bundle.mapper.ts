import { BundleDto, BundleProgramSummaryDto } from 'e-punch-common-core';
import { Bundle, BundleWithProgram } from '../features/bundle/bundle.repository';

export class BundleMapper {
  static toDto(bundleWithProgram: BundleWithProgram): BundleDto {
    const bundleProgram: BundleProgramSummaryDto = {
      id: bundleWithProgram.bundle_program_id,
      name: bundleWithProgram.program_name,
      itemName: bundleWithProgram.program_item_name,
      description: bundleWithProgram.program_description,
      merchantName: bundleWithProgram.merchant_name,
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
    };
  }

  static toDtoArray(bundlesWithProgram: BundleWithProgram[]): BundleDto[] {
    return bundlesWithProgram.map(bundle => this.toDto(bundle));
  }
} 