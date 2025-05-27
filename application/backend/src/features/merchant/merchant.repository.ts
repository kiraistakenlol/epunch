import { Injectable, Inject } from '@nestjs/common';
import { LoyaltyProgramDto, MerchantDto } from 'e-punch-common-core';
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
  created_at: Date;
}

@Injectable()
export class MerchantRepository {
  constructor(
    @Inject('DATABASE_POOL')
    private pool: Pool
  ) {}

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
      WHERE lp.merchant_id = $1
      ORDER BY lp.created_at DESC
    `;
    
    const result = await this.pool.query(query, [merchantId]);
    
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      requiredPunches: row.required_punches,
      rewardDescription: row.reward_description,
      merchant: {
        id: row.merchant_id,
        name: row.merchant_name,
        address: row.merchant_address,
        createdAt: row.merchant_created_at.toISOString(),
      } as MerchantDto,
      createdAt: row.created_at.toISOString(),
    }));
  }
} 