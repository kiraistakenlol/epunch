import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { MerchantUserDto, CreateMerchantUserDto, UpdateMerchantUserDto, Role } from 'e-punch-common-core';
import { MerchantUserMapper } from '../../mappers/merchant-user.mapper';

export interface MerchantUser {
  id: string;
  merchant_id: string;
  login: string;
  password_hash: string;
  role_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MerchantUserWithRole extends Omit<MerchantUser, 'role_id'> {
  role_name: string;
}

@Injectable()
export class MerchantUserRepository {
  constructor(
    @Inject('DATABASE_POOL')
    private pool: Pool
  ) {}

  async findUserByLogin(login: string): Promise<MerchantUser | null> {
    const query = `
      SELECT * FROM merchant_user 
      WHERE login = $1 AND is_active = true
    `;
    
    const result = await this.pool.query(query, [login]);
    return result.rows[0] || null;
  }

  async findUserByMerchantAndLogin(merchantId: string, login: string): Promise<MerchantUser | null> {
    const query = `
      SELECT * FROM merchant_user 
      WHERE merchant_id = $1 AND login = $2 AND is_active = true
    `;
    
    const result = await this.pool.query(query, [merchantId, login]);
    return result.rows[0] || null;
  }

  async findUserByMerchantSlugAndLogin(merchantSlug: string, login: string): Promise<MerchantUser | null> {
    const query = `
      SELECT mu.* FROM merchant_user mu
      JOIN merchant m ON mu.merchant_id = m.id
      WHERE m.slug = $1 AND mu.login = $2 AND mu.is_active = true
    `;
    
    const result = await this.pool.query(query, [merchantSlug, login]);
    return result.rows[0] || null;
  }

  async findUserById(userId: string): Promise<MerchantUser | null> {
    const query = `
      SELECT * FROM merchant_user 
      WHERE id = $1 AND is_active = true
    `;
    
    const result = await this.pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  async findUsersByMerchantId(merchantId: string): Promise<MerchantUserDto[]> {
    const query = `
      SELECT mu.*, r.name as role_name
      FROM merchant_user mu
      JOIN merchant_role r ON mu.role_id = r.id
      WHERE mu.merchant_id = $1 AND mu.is_active = true
      ORDER BY mu.created_at DESC
    `;
    
    const result = await this.pool.query(query, [merchantId]);
    return result.rows.map(row => MerchantUserMapper.fromJoinedQuery(row));
  }

  async createUser(merchantId: string, data: CreateMerchantUserDto & { passwordHash: string }): Promise<MerchantUserDto> {
    const roleId = await this.findRoleIdByName(data.role);
    if (!roleId) {
      throw new Error(`Role '${data.role}' not found`);
    }

    const query = `
      INSERT INTO merchant_user (merchant_id, login, password_hash, role_id, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [merchantId, data.login, data.passwordHash, roleId, true];
    const result = await this.pool.query(query, values);
    
    const user = result.rows[0];
    const role = await this.getUserRole(user.id);
    
    return MerchantUserMapper.toDto(user, role!);
  }

  async updateUser(userId: string, merchantId: string, data: UpdateMerchantUserDto & { passwordHash?: string }): Promise<MerchantUserDto | null> {
    const setParts: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.login !== undefined) {
      setParts.push(`login = $${paramIndex++}`);
      values.push(data.login);
    }
    if (data.passwordHash !== undefined) {
      setParts.push(`password_hash = $${paramIndex++}`);
      values.push(data.passwordHash);
    }
    if (data.role !== undefined) {
      const roleId = await this.findRoleIdByName(data.role);
      if (!roleId) {
        throw new Error(`Role '${data.role}' not found`);
      }
      setParts.push(`role_id = $${paramIndex++}`);
      values.push(roleId);
    }
    if (data.isActive !== undefined) {
      setParts.push(`is_active = $${paramIndex++}`);
      values.push(data.isActive);
    }

    if (setParts.length === 0) {
      const user = await this.findUserById(userId);
      if (!user || user.merchant_id !== merchantId) return null;
      
      const role = await this.getUserRole(userId);
      return MerchantUserMapper.toDto(user, role!);
    }

    setParts.push(`updated_at = NOW()`);

    const query = `
      UPDATE merchant_user 
      SET ${setParts.join(', ')}
      WHERE id = $${paramIndex++} AND merchant_id = $${paramIndex++} AND is_active = true
      RETURNING *
    `;
    
    values.push(userId, merchantId);
    
    const result = await this.pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    const role = await this.getUserRole(userId);
    
    return MerchantUserMapper.toDto(user, role!);
  }

  async deleteUser(userId: string, merchantId: string): Promise<boolean> {
    const query = `
      UPDATE merchant_user 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND merchant_id = $2 AND is_active = true
      RETURNING id
    `;
    
    const result = await this.pool.query(query, [userId, merchantId]);
    return result.rows.length > 0;
  }

  async getUserRole(userId: string): Promise<string | null> {
    const query = `
      SELECT r.name
      FROM merchant_role r
      JOIN merchant_user mu ON r.id = mu.role_id
      WHERE mu.id = $1 AND mu.is_active = true
    `;
    
    const result = await this.pool.query(query, [userId]);
    return result.rows[0]?.name || null;
  }

  async findRoleIdByName(roleName: string): Promise<string | null> {
    const query = `
      SELECT id FROM merchant_role WHERE name = $1
    `;
    
    const result = await this.pool.query(query, [roleName]);
    return result.rows[0]?.id || null;
  }
} 