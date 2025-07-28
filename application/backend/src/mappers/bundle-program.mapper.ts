import { BundleProgramDto, BundleProgramSummaryDto } from 'e-punch-common-core';
import { BundleProgram } from '../features/bundle-program/bundle-program.repository';
import { Merchant } from '../features/merchant/merchant.repository';
import { MerchantMapper } from './merchant.mapper';

export class BundleProgramMapper {
  static toDto(bundleProgram: BundleProgram, merchant: Merchant): BundleProgramDto {
    return {
      id: bundleProgram.id,
      merchantId: bundleProgram.merchant_id,
      name: bundleProgram.name,
      itemName: bundleProgram.item_name,
      description: bundleProgram.description,
      quantityPresets: bundleProgram.quantity_presets,
      isActive: bundleProgram.is_active,
      createdAt: bundleProgram.created_at.toISOString(),
    };
  }

  static toSummaryDto(bundleProgram: BundleProgram, merchant: Merchant): BundleProgramSummaryDto {
    return {
      id: bundleProgram.id,
      name: bundleProgram.name,
      itemName: bundleProgram.item_name,
      description: bundleProgram.description,
      merchant: MerchantMapper.toDto(merchant),
    };
  }

  static toDtoArray(bundlePrograms: BundleProgram[], merchants: Merchant[]): BundleProgramDto[] {
    const merchantMap = new Map(merchants.map(m => [m.id, m]));
    
    return bundlePrograms
      .map(program => {
        const merchant = merchantMap.get(program.merchant_id);
        return merchant ? this.toDto(program, merchant) : null;
      })
      .filter((dto): dto is BundleProgramDto => dto !== null);
  }
} 