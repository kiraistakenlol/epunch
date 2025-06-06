import { Injectable, Logger, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PunchCardStyleDto, CreatePunchCardStyleDto, UpdatePunchCardStyleDto } from 'e-punch-common-core';

@Injectable()
export class PunchCardStyleRepository {
  private readonly logger = new Logger(PunchCardStyleRepository.name);

  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findMerchantDefaultStyle(merchantId: string): Promise<PunchCardStyleDto | null> {
    this.logger.log(`Finding default style for merchant: ${merchantId}`);
    
    const query = `
      SELECT id, merchant_id, loyalty_program_id, primary_color, secondary_color, 
             logo_url, background_image_url, created_at
      FROM punch_card_style 
      WHERE merchant_id = $1 AND loyalty_program_id IS NULL
    `;
    
    const result = await this.pool.query(query, [merchantId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
      logoUrl: row.logo_url,
      backgroundImageUrl: row.background_image_url,
    };
  }

  async createOrUpdateMerchantDefaultStyle(
    merchantId: string, 
    data: CreatePunchCardStyleDto | UpdatePunchCardStyleDto
  ): Promise<PunchCardStyleDto> {
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
            background_image_url = $5
        WHERE merchant_id = $1 AND loyalty_program_id IS NULL
        RETURNING primary_color, secondary_color, logo_url, background_image_url
      `;
      
      result = await this.pool.query(updateQuery, [
        merchantId,
        data.primaryColor || null,
        data.secondaryColor || null,
        data.logoUrl || null,
        data.backgroundImageUrl || null,
      ]);
    } else {
      // Insert new record
      const insertQuery = `
        INSERT INTO punch_card_style (merchant_id, loyalty_program_id, primary_color, secondary_color, logo_url, background_image_url)
        VALUES ($1, NULL, $2, $3, $4, $5)
        RETURNING primary_color, secondary_color, logo_url, background_image_url
      `;
      
      result = await this.pool.query(insertQuery, [
        merchantId,
        data.primaryColor || null,
        data.secondaryColor || null,
        data.logoUrl || null,
        data.backgroundImageUrl || null,
      ]);
    }
    
    const row = result.rows[0];
    return {
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
      logoUrl: row.logo_url,
      backgroundImageUrl: row.background_image_url,
    };
  }

  async updateMerchantDefaultLogo(merchantId: string, logoUrl: string): Promise<PunchCardStyleDto> {
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
        RETURNING primary_color, secondary_color, logo_url, background_image_url
      `;
      
      result = await this.pool.query(updateQuery, [merchantId, logoUrl]);
    } else {
      // Insert new record - only set logo_url, other fields empty
      const insertQuery = `
        INSERT INTO punch_card_style (merchant_id, loyalty_program_id, logo_url)
        VALUES ($1, NULL, $2)
        RETURNING primary_color, secondary_color, logo_url, background_image_url
      `;
      
      result = await this.pool.query(insertQuery, [merchantId, logoUrl]);
    }
    
    const row = result.rows[0];
    return {
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
      logoUrl: row.logo_url,
      backgroundImageUrl: row.background_image_url,
    };
  }

  async findLoyaltyProgramStyle(merchantId: string, loyaltyProgramId: string): Promise<PunchCardStyleDto | null> {
    this.logger.log(`Finding style for loyalty program: ${loyaltyProgramId} in merchant: ${merchantId}`);
    
    const query = `
      SELECT id, merchant_id, loyalty_program_id, primary_color, secondary_color, 
             logo_url, background_image_url, created_at
      FROM punch_card_style 
      WHERE merchant_id = $1 AND loyalty_program_id = $2
    `;
    
    const result = await this.pool.query(query, [merchantId, loyaltyProgramId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
      logoUrl: row.logo_url,
      backgroundImageUrl: row.background_image_url,
    };
  }

  async createOrUpdateLoyaltyProgramStyle(
    merchantId: string,
    loyaltyProgramId: string,
    data: CreatePunchCardStyleDto | UpdatePunchCardStyleDto
  ): Promise<PunchCardStyleDto> {
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
            logo_url = $5,
            background_image_url = $6
        WHERE merchant_id = $1 AND loyalty_program_id = $2
        RETURNING primary_color, secondary_color, logo_url, background_image_url
      `;
      
      result = await this.pool.query(updateQuery, [
        merchantId,
        loyaltyProgramId,
        data.primaryColor || null,
        data.secondaryColor || null,
        data.logoUrl || null,
        data.backgroundImageUrl || null,
      ]);
    } else {
      // Insert new record
      const insertQuery = `
        INSERT INTO punch_card_style (merchant_id, loyalty_program_id, primary_color, secondary_color, logo_url, background_image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING primary_color, secondary_color, logo_url, background_image_url
      `;
      
      result = await this.pool.query(insertQuery, [
        merchantId,
        loyaltyProgramId,
        data.primaryColor || null,
        data.secondaryColor || null,
        data.logoUrl || null,
        data.backgroundImageUrl || null,
      ]);
    }
    
    const row = result.rows[0];
    return {
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
      logoUrl: row.logo_url,
      backgroundImageUrl: row.background_image_url,
    };
  }
} 