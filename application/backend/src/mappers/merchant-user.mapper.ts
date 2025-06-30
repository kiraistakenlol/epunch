import { MerchantUserDto, Role } from 'e-punch-common-core';
import { MerchantUser } from '../features/merchant-user/merchant-user.repository';

export class MerchantUserMapper {
  static toDto(user: MerchantUser, roleName: string): MerchantUserDto {
    return {
      id: user.id,
      merchantId: user.merchant_id,
      login: user.login,
      role: roleName as Role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  static fromJoinedQuery(row: any): MerchantUserDto {
    return {
      id: row.id,
      merchantId: row.merchant_id,
      login: row.login,
      role: row.role_name as Role,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
} 