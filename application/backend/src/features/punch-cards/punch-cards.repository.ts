import { Injectable, Inject } from '@nestjs/common';
import { PunchCardStatusDto as PunchCardStatus, PunchIconsDto } from 'e-punch-common-core';
import { Pool } from 'pg';

export interface PunchCard {
  id: string;
  user_id: string;
  loyalty_program_id: string;
  current_punches: number;
  status: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';
  completed_at: Date | null;
  redeemed_at: Date | null;
  last_punch_at: Date | null;
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

export interface PunchCardDetails {
  id: string;
  user_id: string;
  loyalty_program_id: string;
  current_punches: number;
  status: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';
  merchant_name: string;
  merchant_address: string;
  required_punches: number;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  background_image_url: string;
  punch_icons: PunchIconsDto | null;
  completed_at: Date | null;
  redeemed_at: Date | null;
  last_punch_at: Date | null;
  created_at: Date;
}

@Injectable()
export class PunchCardsRepository {
  constructor(
    @Inject('DATABASE_POOL')
    private pool: Pool
  ) { }

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
    status: PunchCardStatus,
    completedAt?: Date,
    lastPunchAt?: Date
  ): Promise<PunchCard> {
    const query = `
      UPDATE punch_card 
      SET current_punches = $2, status = $3, completed_at = $4, last_punch_at = $5
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      punchCardId, 
      newPunchCount, 
      status, 
      completedAt || null,
      lastPunchAt || null
    ]);

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

  async findPunchCardDetailsByUserId(userId: string): Promise<PunchCardDetails[]> {
    const query = `
      SELECT
        pc.id,
        pc.user_id,
        pc.loyalty_program_id,
        pc.current_punches,
        pc.status,
        pc.completed_at,
        pc.redeemed_at,
        pc.last_punch_at,
        pc.created_at,
        m.name as merchant_name,
        m.address as merchant_address,
        lp.required_punches,
        COALESCE(specific_style.primary_color, default_style.primary_color) as primary_color,
        COALESCE(specific_style.secondary_color, default_style.secondary_color) as secondary_color,
        COALESCE(specific_style.logo_url, default_style.logo_url) as logo_url,
        COALESCE(specific_style.background_image_url, default_style.background_image_url) as background_image_url,
        COALESCE(specific_style.punch_icons, default_style.punch_icons) as punch_icons
      FROM punch_card pc
      JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
      JOIN merchant m ON lp.merchant_id = m.id
      LEFT JOIN punch_card_style specific_style ON specific_style.loyalty_program_id = lp.id
      LEFT JOIN punch_card_style default_style ON default_style.merchant_id = m.id AND default_style.loyalty_program_id IS NULL
      WHERE pc.user_id = $1
      ORDER BY pc.created_at DESC
    `;

    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async findPunchCardById(punchCardId: string): Promise<PunchCard | null> {
    const query = `
      SELECT * FROM punch_card
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [punchCardId]);

    return result.rows[0] || null;
  }

  async updatePunchCardStatus(punchCardId: string, status: PunchCardStatus, redeemedAt?: Date): Promise<PunchCard> {
    const query = `
      UPDATE punch_card 
      SET status = $2, redeemed_at = $3
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.pool.query(query, [punchCardId, status, redeemedAt || null]);

    if (!result.rows[0]) {
      throw new Error('Failed to update punch card status');
    }

    return result.rows[0];
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