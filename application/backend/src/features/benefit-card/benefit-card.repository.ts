import { Injectable, Logger, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { Merchant } from '../merchant/merchant.repository';
import { PunchCardStyle } from '../punch-card-style/punch-card-style.repository';

export interface BenefitCard {
  id: string;
  user_id: string;
  merchant_id: string;
  item_name: string;
  expires_at: Date | null;
  created_at: Date;
}

export interface BenefitCardWithMerchant extends BenefitCard {
  merchant: Merchant;
  styles: Omit<PunchCardStyle, 'id' | 'merchant_id' | 'loyalty_program_id' | 'created_at'>;
}

@Injectable()
export class BenefitCardRepository {
  private readonly logger = new Logger(BenefitCardRepository.name);

  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findUserBenefitCards(userId: string): Promise<BenefitCardWithMerchant[]> {
    const query = `
      SELECT 
        bc.*,
        m.id as merchant_id,
        m.name as merchant_name,
        m.address as merchant_address,
        m.slug as merchant_slug,
        m.logo_url as merchant_logo_url,
        m.created_at as merchant_created_at,
        merchant_style.primary_color,
        merchant_style.secondary_color,
        merchant_style.logo_url as style_logo_url,
        merchant_style.background_image_url,
        merchant_style.punch_icons
      FROM benefit_card bc
      JOIN merchant m ON bc.merchant_id = m.id
      LEFT JOIN punch_card_style merchant_style ON merchant_style.merchant_id = bc.merchant_id
      WHERE bc.user_id = $1
      ORDER BY bc.created_at DESC
    `;
    
    try {
      const result = await this.pool.query(query, [userId]);
      this.logger.log(`Found ${result.rows.length} benefit cards for user: ${userId}`);
      
      return result.rows.map(row => ({
        id: row.id,
        user_id: row.user_id,
        merchant_id: row.merchant_id,
        item_name: row.item_name,
        expires_at: row.expires_at,
        created_at: row.created_at,
        merchant: {
          id: row.merchant_id,
          name: row.merchant_name,
          address: row.merchant_address,
          slug: row.merchant_slug,
          logo_url: row.merchant_logo_url,
          created_at: row.merchant_created_at
        },
        styles: {
          primary_color: row.primary_color,
          secondary_color: row.secondary_color,
          logo_url: row.style_logo_url,
          background_image_url: row.background_image_url,
          punch_icons: row.punch_icons
        }
      }));
    } catch (error: any) {
      this.logger.error(`Error finding benefit cards for user ${userId}:`, error.message);
      throw error;
    }
  }

  async createBenefitCard(userId: string, merchantId: string, itemName: string, expiresAt: Date | null): Promise<BenefitCard> {
    const query = `
      INSERT INTO benefit_card (user_id, merchant_id, item_name, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [userId, merchantId, itemName, expiresAt];
    
    try {
      const result = await this.pool.query(query, values);
      const benefitCard = result.rows[0];
      this.logger.log(`Created benefit card: ${benefitCard.id}`);
      return benefitCard;
    } catch (error: any) {
      this.logger.error(`Error creating benefit card for user ${userId}:`, error.message);
      throw error;
    }
  }

  async getBenefitCardById(benefitCardId: string): Promise<BenefitCardWithMerchant> {
    const query = `
      SELECT 
        bc.*,
        m.id as merchant_id,
        m.name as merchant_name,
        m.address as merchant_address,
        m.slug as merchant_slug,
        m.logo_url as merchant_logo_url,
        m.created_at as merchant_created_at,
        merchant_style.primary_color,
        merchant_style.secondary_color,
        merchant_style.logo_url as style_logo_url,
        merchant_style.background_image_url,
        merchant_style.punch_icons
      FROM benefit_card bc
      JOIN merchant m ON bc.merchant_id = m.id
      LEFT JOIN punch_card_style merchant_style ON merchant_style.merchant_id = bc.merchant_id
      WHERE bc.id = $1
    `;
    
    try {
      const result = await this.pool.query(query, [benefitCardId]);
      if (result.rows.length === 0) {
        throw new Error(`Benefit card not found: ${benefitCardId}`);
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        user_id: row.user_id,
        merchant_id: row.merchant_id,
        item_name: row.item_name,
        expires_at: row.expires_at,
        created_at: row.created_at,
        merchant: {
          id: row.merchant_id,
          name: row.merchant_name,
          address: row.merchant_address,
          slug: row.merchant_slug,
          logo_url: row.merchant_logo_url,
          created_at: row.merchant_created_at
        },
        styles: {
          primary_color: row.primary_color,
          secondary_color: row.secondary_color,
          logo_url: row.style_logo_url,
          background_image_url: row.background_image_url,
          punch_icons: row.punch_icons
        }
      };
    } catch (error: any) {
      this.logger.error(`Error finding benefit card ${benefitCardId}:`, error.message);
      throw error;
    }
  }
}