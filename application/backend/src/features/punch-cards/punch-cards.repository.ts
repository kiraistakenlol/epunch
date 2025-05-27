import { Injectable, Inject } from '@nestjs/common';
import { PunchCardDto, PunchCardStatusDto } from 'e-punch-common-core';
import { Pool, PoolClient } from 'pg';

export interface PunchCard {
  id: string;
  user_id: string;
  loyalty_program_id: string;
  current_punches: number;
  status: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';
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

export interface Merchant {
  id: string;
  name: string;
  address: string | null;
  created_at: Date;
}

export interface Punch {
  id: string;
  punch_card_id: string;
  created_at: Date;
}

export type PunchCardStatus = 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';

@Injectable()
export class PunchCardsRepository {
  constructor(
    @Inject('DATABASE_POOL')
    private pool: Pool
  ) {}

  async findLoyaltyProgramById(loyaltyProgramId: string): Promise<LoyaltyProgram | null> {
    const query = `
      SELECT * FROM loyalty_program 
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [loyaltyProgramId]);
    return result.rows[0] || null;
  }

  async findPunchCardByUserIdAndLoyaltyProgramId(
    userId: string,
    loyaltyProgramId: string,
    requiredPunchesForProgram: number
  ): Promise<PunchCard | null> {
    const query = `
      SELECT * FROM punch_card 
      WHERE user_id = $1 
        AND loyalty_program_id = $2 
        AND current_punches < $3
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [userId, loyaltyProgramId, requiredPunchesForProgram]);
    return result.rows[0] || null;
  }

  async findTop1PunchCardByUserIdAndLoyaltyProgramIdAndStatusOrderByCreatedAtDesc(
    userId: string,
    loyaltyProgramId: string,
    status: PunchCardStatus
  ): Promise<PunchCard | null> {
    const query = `
      SELECT * FROM punch_card 
      WHERE user_id = $1 
        AND loyalty_program_id = $2 
        AND status = $3
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [userId, loyaltyProgramId, status]);
    return result.rows[0] || null;
  }

  async createPunchCard(userId: string, loyaltyProgramId: string): Promise<PunchCard> {
    const query = `
      INSERT INTO punch_card (user_id, loyalty_program_id, current_punches, status)
      VALUES ($1, $2, 0, 'ACTIVE')
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [userId, loyaltyProgramId]);
    
    if (!result.rows[0]) {
      throw new Error('Failed to create punch card');
    }
    
    return result.rows[0];
  }

  async updatePunchCardPunchesAndStatus(
    punchCardId: string,
    newPunchCount: number,
    status: PunchCardStatus
  ): Promise<PunchCard> {
    const query = `
      UPDATE punch_card 
      SET current_punches = $2, status = $3
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [punchCardId, newPunchCount, status]);
    
    if (!result.rows[0]) {
      throw new Error('Failed to update punch card');
    }
    
    return result.rows[0];
  }

  async createPunchRecord(punchCardId: string): Promise<Punch> {
    const query = `
      INSERT INTO punch (punch_card_id)
      VALUES ($1)
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [punchCardId]);
    
    if (!result.rows[0]) {
      throw new Error('Failed to create punch record');
    }
    
    return result.rows[0];
  }

  async findPunchCardsByUserId(userId: string): Promise<PunchCardDto[]> {
    const query = `
      SELECT 
        pc.*,
        lp.name as loyalty_program_name,
        lp.required_punches,
        m.name as merchant_name,
        m.address as merchant_address
      FROM punch_card pc
      JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
      JOIN merchant m ON lp.merchant_id = m.id
      WHERE pc.user_id = $1
      ORDER BY pc.created_at DESC
    `;
    
    const result = await this.pool.query(query, [userId]);
    
    return result.rows.map((row) => {
      let status: PunchCardStatusDto;
      if (row.current_punches >= row.required_punches) {
        status = 'REWARD_READY';
      } else {
        status = 'ACTIVE';
      }
      
      return {
        id: row.id,
        loyaltyProgramId: row.loyalty_program_id,
        shopName: row.merchant_name,
        shopAddress: row.merchant_address || '',
        currentPunches: row.current_punches,
        totalPunches: row.required_punches,
        status: status,
        createdAt: row.created_at.toISOString(),
      };
    });
  }

  async findPunchCardById(punchCardId: string): Promise<PunchCardDto | null> {
    const query = `
      SELECT 
        pc.*,
        lp.name as loyalty_program_name,
        lp.required_punches,
        m.name as merchant_name,
        m.address as merchant_address
      FROM punch_card pc
      JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
      JOIN merchant m ON lp.merchant_id = m.id
      WHERE pc.id = $1
    `;
    
    const result = await this.pool.query(query, [punchCardId]);
    
    if (!result.rows[0]) {
      return null;
    }

    const row = result.rows[0];
    let status: PunchCardStatusDto;
    if (row.current_punches >= row.required_punches) {
      status = 'REWARD_READY';
    } else {
      status = 'ACTIVE';
    }
    
    return {
      id: row.id,
      loyaltyProgramId: row.loyalty_program_id,
      shopName: row.merchant_name,
      shopAddress: row.merchant_address || '',
      currentPunches: row.current_punches,
      totalPunches: row.required_punches,
      status: status,
      createdAt: row.created_at.toISOString(),
    };
  }

  async updatePunchCardStatus(punchCardId: string, status: PunchCardStatus): Promise<PunchCardDto> {
    const updateQuery = `
      UPDATE punch_card 
      SET status = $2
      WHERE id = $1
      RETURNING *
    `;
    
    const updateResult = await this.pool.query(updateQuery, [punchCardId, status]);
    
    if (!updateResult.rows[0]) {
      throw new Error('Failed to update punch card status');
    }

    const selectQuery = `
      SELECT 
        pc.*,
        lp.name as loyalty_program_name,
        lp.required_punches,
        m.name as merchant_name,
        m.address as merchant_address
      FROM punch_card pc
      JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
      JOIN merchant m ON lp.merchant_id = m.id
      WHERE pc.id = $1
    `;
    
    const selectResult = await this.pool.query(selectQuery, [punchCardId]);
    const row = selectResult.rows[0];
    
    let statusDto: PunchCardStatusDto;
    if (row.current_punches >= row.required_punches && status !== 'REWARD_REDEEMED') {
      statusDto = 'REWARD_READY';
    } else if (status === 'REWARD_REDEEMED') {
      statusDto = 'REWARD_REDEEMED';
    } else {
      statusDto = 'ACTIVE';
    }
    
    return {
      id: row.id,
      loyaltyProgramId: row.loyalty_program_id,
      shopName: row.merchant_name,
      shopAddress: row.merchant_address || '',
      currentPunches: row.current_punches,
      totalPunches: row.required_punches,
      status: statusDto,
      createdAt: row.created_at.toISOString(),
    };
  }

  async transferCards(fromUserId: string, toUserId: string): Promise<number> {
    const query = `
      UPDATE punch_card 
      SET user_id = $2
      WHERE user_id = $1
    `;
    
    const result = await this.pool.query(query, [fromUserId, toUserId]);
    return result.rowCount || 0;
  }

  async getUserIdFromPunchCard(punchCardId: string): Promise<string | null> {
    const query = `SELECT user_id FROM punch_card WHERE id = $1`;
    const result = await this.pool.query(query, [punchCardId]);
    
    if (!result.rows[0]) {
      return null;
    }
    
    return result.rows[0].user_id;
  }
} 