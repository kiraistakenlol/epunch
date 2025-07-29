import { Injectable, Logger, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core';

export interface PunchCardStyle {
  id: string;
  merchant_id: string;
  loyalty_program_id?: string;
  primary_color: string | null;
  secondary_color: string | null;
  logo_url: string | null;
  background_image_url: string | null;
  punch_icons: PunchIconsDto | null;
  created_at: Date;
}

@Injectable()
export class PunchCardStyleRepository {
  private readonly logger = new Logger(PunchCardStyleRepository.name);

  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findMerchantDefaultStyle(merchantId: string): Promise<PunchCardStyle | null> {
    this.logger.log(`Finding default style for merchant: ${merchantId}`);
    
    const query = `
      SELECT id, merchant_id, loyalty_program_id, primary_color, secondary_color, 
             logo_url, background_image_url, punch_icons, created_at
      FROM punch_card_style 
      WHERE merchant_id = $1 AND loyalty_program_id IS NULL
    `;
    
    const result = await this.pool.query(query, [merchantId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  async createOrUpdateMerchantDefaultStyle(
    merchantId: string, 
    data: PunchCardStyleDto
  ): Promise<PunchCardStyle> {
    this.logger.log(`Creating or updating default style for merchant: ${merchantId}`);
    
    // First check if a default style exists for this merchant
    const existingStyle = await this.findMerchantDefaultStyle(merchantId);
    
    let result;
    if (existingStyle) {
      // Update existing record
      const updateQuery = `
        UPDATE punch_card_style 
        SET primary_color = $2,
            secondary_color = $3,
            logo_url = $4,
            punch_icons = $5
        WHERE merchant_id = $1 AND loyalty_program_id IS NULL
        RETURNING *
      `;
      
      result = await this.pool.query(updateQuery, [
        merchantId,
        data.primaryColor || null,
        data.secondaryColor || null,
        data.logoUrl || null,

        data.punchIcons || null,
      ]);
    } else {
      // Insert new record
      const insertQuery = `
        INSERT INTO punch_card_style (merchant_id, loyalty_program_id, primary_color, secondary_color, logo_url, punch_icons)
        VALUES ($1, NULL, $2, $3, $4, $5)
        RETURNING *
      `;
      
      result = await this.pool.query(insertQuery, [
        merchantId,
        data.primaryColor || null,
        data.secondaryColor || null,
        data.logoUrl || null,
        data.punchIcons || null,
      ]);
    }
    
    return result.rows[0];
  }

  async updateMerchantDefaultLogo(merchantId: string, logoUrl: string): Promise<PunchCardStyle> {
    this.logger.log(`Updating default logo for merchant: ${merchantId}`);
    
    // First check if a default style exists for this merchant
    const existingStyle = await this.findMerchantDefaultStyle(merchantId);
    
    let result;
    if (existingStyle) {
      // Update existing record - only update logo_url
      const updateQuery = `
        UPDATE punch_card_style 
        SET logo_url = $2
        WHERE merchant_id = $1 AND loyalty_program_id IS NULL
        RETURNING *
      `;
      
      result = await this.pool.query(updateQuery, [merchantId, logoUrl]);
    } else {
      // Insert new record - only set logo_url, other fields empty
      const insertQuery = `
        INSERT INTO punch_card_style (merchant_id, loyalty_program_id, logo_url)
        VALUES ($1, NULL, $2)
        RETURNING *
      `;
      
      result = await this.pool.query(insertQuery, [merchantId, logoUrl]);
    }
    
    return result.rows[0];
  }

  async findLoyaltyProgramStyle(merchantId: string, loyaltyProgramId: string): Promise<PunchCardStyle | null> {
    this.logger.log(`Finding style for loyalty program: ${loyaltyProgramId} in merchant: ${merchantId}`);
    
    const query = `
      SELECT id, merchant_id, loyalty_program_id, primary_color, secondary_color, 
             logo_url, background_image_url, punch_icons, created_at
      FROM punch_card_style 
      WHERE merchant_id = $1 AND loyalty_program_id = $2
    `;
    
    const result = await this.pool.query(query, [merchantId, loyaltyProgramId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  async createOrUpdateLoyaltyProgramStyle(
    merchantId: string,
    loyaltyProgramId: string,
    data: PunchCardStyleDto
  ): Promise<PunchCardStyle> {
    this.logger.log(`Creating or updating style for loyalty program: ${loyaltyProgramId} in merchant: ${merchantId}`);
    
    // First check if a style exists for this loyalty program
    const existingStyle = await this.findLoyaltyProgramStyle(merchantId, loyaltyProgramId);
    
    let result;
    if (existingStyle) {
      // Update existing record
      const updateQuery = `
        UPDATE punch_card_style 
        SET primary_color = $3,
            secondary_color = $4,
            logo_url = $5
        WHERE merchant_id = $1 AND loyalty_program_id = $2
        RETURNING *
      `;
      
      result = await this.pool.query(updateQuery, [
        merchantId,
        loyaltyProgramId,
        data.primaryColor || null,
        data.secondaryColor || null,
        data.logoUrl || null,
      ]);
    } else {
      // Insert new record
      const insertQuery = `
        INSERT INTO punch_card_style (merchant_id, loyalty_program_id, primary_color, secondary_color, logo_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      result = await this.pool.query(insertQuery, [
        merchantId,
        loyaltyProgramId,
        data.primaryColor || null,
        data.secondaryColor || null,
        data.logoUrl || null,
      ]);
    }
    
    return result.rows[0];
  }
} 