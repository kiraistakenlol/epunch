import { Injectable, Inject } from '@nestjs/common';
import { LoyaltyProgramDto, MerchantDto, CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto } from 'e-punch-common-core';
import { Pool } from 'pg';

export interface Merchant {
  id: string;
  name: string;
  address: string | null;
  login?: string;
  password_hash?: string;
  created_at: Date;
}

export interface LoyaltyProgram {
  id: string;
  merchant_id: string;
  name: string;
  description: string | null;
  required_punches: number;
  reward_description: string;
  is_active: boolean;
  created_at: Date;
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
    
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      email: row.login || '',
      createdAt: row.created_at.toISOString(),
    }));
  }

  async findMerchantById(merchantId: string): Promise<Merchant | null> {
    const query = `
      SELECT * FROM merchant 
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [merchantId]);
    return result.rows[0] || null;
  }

  async findMerchantByLogin(login: string): Promise<Merchant | null> {
    const query = `
      SELECT * FROM merchant 
      WHERE login = $1
    `;
    
    const result = await this.pool.query(query, [login]);
    return result.rows[0] || null;
  }

  async findLoyaltyProgramsByMerchantId(merchantId: string): Promise<LoyaltyProgramDto[]> {
    const query = `
      SELECT 
        lp.*,
        m.name as merchant_name,
        m.address as merchant_address,
        m.created_at as merchant_created_at
      FROM loyalty_program lp
      JOIN merchant m ON lp.merchant_id = m.id
      WHERE lp.merchant_id = $1 AND lp.is_active = true
      ORDER BY lp.created_at DESC
    `;
    
    const result = await this.pool.query(query, [merchantId]);
    
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      requiredPunches: row.required_punches,
      rewardDescription: row.reward_description,
      isActive: row.is_active,
      merchant: {
        id: row.merchant_id,
        name: row.merchant_name,
        address: row.merchant_address,
        email: '',
        createdAt: row.merchant_created_at.toISOString(),
      },
      createdAt: row.created_at.toISOString(),
    }));
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
    
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      requiredPunches: row.required_punches,
      rewardDescription: row.reward_description,
      isActive: row.is_active,
      merchant: {
        id: merchant!.id,
        name: merchant!.name,
        address: merchant!.address,
        email: merchant!.login || '',
        createdAt: merchant!.created_at.toISOString(),
      },
      createdAt: row.created_at.toISOString(),
    };
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
    
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      requiredPunches: row.required_punches,
      rewardDescription: row.reward_description,
      isActive: row.is_active,
      merchant: {
        id: merchant!.id,
        name: merchant!.name,
        address: merchant!.address,
        email: merchant!.login || '',
        createdAt: merchant!.created_at.toISOString(),
      },
      createdAt: row.created_at.toISOString(),
    };
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
} 