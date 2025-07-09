import { Injectable, Inject } from '@nestjs/common';
import { LoyaltyProgramDto, MerchantDto, CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto, CreateMerchantDto, UpdateMerchantDto } from 'e-punch-common-core';
import { Pool } from 'pg';
import { MerchantMapper, LoyaltyProgramMapper } from '../../mappers';

export interface Merchant {
  id: string;
  name: string;
  address: string | null;
  slug: string;
  created_at: Date;
  logo_url: string | null;
}

@Injectable()
export class MerchantRepository {
  constructor(
    @Inject('DATABASE_POOL')
    private pool: Pool
  ) {}

  async findAllMerchants(): Promise<MerchantDto[]> {
    const query = `
      SELECT * FROM merchant 
      ORDER BY name ASC
    `;
    
    const result = await this.pool.query(query);
    
    return MerchantMapper.toDtoArray(result.rows);
  }

  async findMerchantById(merchantId: string): Promise<Merchant | null> {
    const query = `
      SELECT * FROM merchant 
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [merchantId]);
    return result.rows[0] || null;
  }

  async findMerchantBySlug(slug: string): Promise<Merchant | null> {
    const query = `
      SELECT * FROM merchant 
      WHERE slug = $1
    `;
    
    const result = await this.pool.query(query, [slug]);
    return result.rows[0] || null;
  }

  async findLoyaltyProgramsByMerchantId(merchantId: string): Promise<LoyaltyProgramDto[]> {
    const query = `
      SELECT 
        lp.*,
        m.name as merchant_name,
        m.address as merchant_address,
        m.slug as merchant_slug,
        m.logo_url as merchant_logo_url,
        m.created_at as merchant_created_at
      FROM loyalty_program lp
      JOIN merchant m ON lp.merchant_id = m.id
      WHERE lp.merchant_id = $1
      ORDER BY lp.created_at DESC
    `;
    
    const result = await this.pool.query(query, [merchantId]);
    
    return LoyaltyProgramMapper.fromJoinedQueryArray(result.rows);
  }

  async createLoyaltyProgram(merchantId: string, data: CreateLoyaltyProgramDto): Promise<LoyaltyProgramDto> {
    const query = `
      INSERT INTO loyalty_program (merchant_id, name, description, required_punches, reward_description, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      merchantId,
      data.name,
      data.description || null,
      data.requiredPunches,
      data.rewardDescription,
      data.isActive ?? true
    ];
    
    const result = await this.pool.query(query, values);
    const row = result.rows[0];
    
    const merchant = await this.findMerchantById(merchantId);
    
    return LoyaltyProgramMapper.toDto(row, merchant!);
  }

  async updateLoyaltyProgram(merchantId: string, programId: string, data: UpdateLoyaltyProgramDto): Promise<LoyaltyProgramDto | null> {
    const setParts: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      setParts.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      setParts.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.requiredPunches !== undefined) {
      setParts.push(`required_punches = $${paramIndex++}`);
      values.push(data.requiredPunches);
    }
    if (data.rewardDescription !== undefined) {
      setParts.push(`reward_description = $${paramIndex++}`);
      values.push(data.rewardDescription);
    }
    if (data.isActive !== undefined) {
      setParts.push(`is_active = $${paramIndex++}`);
      values.push(data.isActive);
    }

    if (setParts.length === 0) {
      const programs = await this.findLoyaltyProgramsByMerchantId(merchantId);
      return programs.find(p => p.id === programId) || null;
    }

    const query = `
      UPDATE loyalty_program 
      SET ${setParts.join(', ')}
      WHERE id = $${paramIndex++} AND merchant_id = $${paramIndex++}
      RETURNING *
    `;
    
    values.push(programId, merchantId);
    
    const result = await this.pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    const merchant = await this.findMerchantById(merchantId);
    
    return LoyaltyProgramMapper.toDto(row, merchant!);
  }

  async deleteLoyaltyProgram(merchantId: string, programId: string): Promise<boolean> {
    const query = `
      UPDATE loyalty_program 
      SET is_active = false
      WHERE id = $1 AND merchant_id = $2 AND is_active = true
      RETURNING id
    `;
    
    const result = await this.pool.query(query, [programId, merchantId]);
    return result.rows.length > 0;
  }

  async createMerchant(data: CreateMerchantDto): Promise<MerchantDto> {
    const query = `
      INSERT INTO merchant (name, address, slug)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [
      data.name,
      data.address || null,
      data.slug
    ];
    
    const result = await this.pool.query(query, values);
    const row = result.rows[0];
    
    return MerchantMapper.toDto(row);
  }

  async updateMerchant(merchantId: string, data: UpdateMerchantDto): Promise<MerchantDto | null> {
    const setParts: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      setParts.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.address !== undefined) {
      setParts.push(`address = $${paramIndex++}`);
      values.push(data.address);
    }
    if (data.slug !== undefined) {
      setParts.push(`slug = $${paramIndex++}`);
      values.push(data.slug);
    }
    if (data.logoUrl !== undefined) {
      setParts.push(`logo_url = $${paramIndex++}`);
      values.push(data.logoUrl);
    }

    if (setParts.length === 0) {
      const merchant = await this.findMerchantById(merchantId);
      if (!merchant) return null;
      
      return MerchantMapper.toDto(merchant);
    }

    const query = `
      UPDATE merchant 
      SET ${setParts.join(', ')}
      WHERE id = $${paramIndex++}
      RETURNING *
    `;
    
    values.push(merchantId);
    
    const result = await this.pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    
    return MerchantMapper.toDto(row);
  }

  async deleteMerchant(merchantId: string): Promise<boolean> {
    const query = `
      DELETE FROM merchant 
      WHERE id = $1
      RETURNING id
    `;
    
    const result = await this.pool.query(query, [merchantId]);
    return result.rows.length > 0;
  }

  async findCustomersByMerchantId(
    merchantId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<any[]> {
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let orderClause = 'ORDER BY u.created_at DESC';
    const queryParams: any[] = [merchantId, limit, offset];
    let paramIndex = 4;
    
    if (search) {
      whereClause = `AND (u.email ILIKE $${paramIndex} OR u.id ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    if (sortBy && sortOrder) {
      const validSortFields = ['email', 'created_at', 'id'];
      if (validSortFields.includes(sortBy)) {
        orderClause = `ORDER BY u.${sortBy} ${sortOrder.toUpperCase()}`;
      }
    }
    
    const query = `
      SELECT DISTINCT u.id, u.email, u.external_id, u.external_provider, u.super_admin, u.created_at
      FROM "user" u
      JOIN punch_card pc ON u.id = pc.user_id
      JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
      WHERE lp.merchant_id = $1 ${whereClause}
      ${orderClause}
      LIMIT $2 OFFSET $3
    `;
    
    const result = await this.pool.query(query, queryParams);
    return result.rows;
  }

  async countCustomersByMerchantId(merchantId: string, search?: string): Promise<number> {
    let whereClause = '';
    const queryParams: any[] = [merchantId];
    let paramIndex = 2;
    
    if (search) {
      whereClause = `AND (u.email ILIKE $${paramIndex} OR u.id ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
    }
    
    const query = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM "user" u
      JOIN punch_card pc ON u.id = pc.user_id
      JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
      WHERE lp.merchant_id = $1 ${whereClause}
    `;
    
    const result = await this.pool.query(query, queryParams);
    return parseInt(result.rows[0].total) || 0;
  }

  async findCustomerByMerchantAndId(merchantId: string, customerId: string): Promise<any | null> {
    const query = `
      SELECT DISTINCT u.id, u.email, u.external_id, u.external_provider, u.super_admin, u.created_at
      FROM "user" u
      JOIN punch_card pc ON u.id = pc.user_id
      JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
      WHERE lp.merchant_id = $1 AND u.id = $2
    `;
    
    const result = await this.pool.query(query, [merchantId, customerId]);
    return result.rows[0] || null;
  }
} 