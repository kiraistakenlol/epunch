import { MerchantDto } from 'e-punch-common-core';
import { Merchant } from '../features/merchant/merchant.repository';

export class MerchantMapper {
  static toDto(merchant: Merchant): MerchantDto {
    return {
      id: merchant.id,
      name: merchant.name,
      address: merchant.address || '',
      slug: merchant.slug,
      email: merchant.login || '',
      logoUrl: merchant.logo_url || '',
      createdAt: merchant.created_at.toISOString(),
    };
  }

  static toDtoArray(merchants: Merchant[]): MerchantDto[] {
    return merchants.map(merchant => this.toDto(merchant));
  }
} 