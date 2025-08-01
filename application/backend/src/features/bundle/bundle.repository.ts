import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { Merchant } from '../merchant/merchant.repository';
import { PunchCardStyle } from '../punch-card-style/punch-card-style.repository';

export interface Bundle {
  id: string;
  user_id: string;
  bundle_program_id: string;
  
  item_name: string;
  description: string | null;
  merchant_id: string;
  
  original_quantity: number;
  remaining_quantity: number;
  expires_at: Date | null;
  created_at: Date;
  last_used_at: Date | null;
}

export interface BundleWithMerchantAndStyles extends Bundle {
  merchant: Merchant;
  styles: Omit<PunchCardStyle, 'id' | 'merchant_id' | 'loyalty_program_id' | 'created_at'>;
}



@Injectable()
export class BundleRepository {
  private readonly logger = new Logger(BundleRepository.name);

  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findBundle(bundleId: string): Promise<BundleWithMerchantAndStyles | null> {
    this.logger.log(`Finding bundle by ID: ${bundleId}`);
    
    const query = `
      SELECT 
        b.*,
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
      FROM bundle b
      JOIN merchant m ON b.merchant_id = m.id
      LEFT JOIN punch_card_style merchant_style ON merchant_style.merchant_id = b.merchant_id
      WHERE b.id = $1
    `;
    
    try {
      const result = await this.pool.query(query, [bundleId]);
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        user_id: row.user_id,
        bundle_program_id: row.bundle_program_id,
        item_name: row.item_name,
        description: row.description,
        merchant_id: row.merchant_id,
        original_quantity: row.original_quantity,
        remaining_quantity: row.remaining_quantity,
        expires_at: row.expires_at,
        created_at: row.created_at,
        last_used_at: row.last_used_at,
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
      this.logger.error(`Error finding bundle by ID ${bundleId}:`, error.message);
      throw error;
    }
  }

  async getBundleById(id: string): Promise<BundleWithMerchantAndStyles> {
    this.logger.log(`Getting bundle by ID: ${id}`);
    
    const bundle = await this.findBundle(id);
    
    if (!bundle) {
      this.logger.error(`Bundle with ID ${id} not found`);
      throw new NotFoundException(`Bundle with ID ${id} not found`);
    }
    
    return bundle;
  }

  async findUserBundles(userId: string): Promise<BundleWithMerchantAndStyles[]> {
    this.logger.log(`Finding bundles for user: ${userId}`);
    
    const query = `
      SELECT 
        b.*,
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
      FROM bundle b
      JOIN merchant m ON b.merchant_id = m.id
      LEFT JOIN punch_card_style merchant_style ON merchant_style.merchant_id = b.merchant_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `;
    
    try {
      const result = await this.pool.query(query, [userId]);
      this.logger.log(`Found ${result.rows.length} bundles for user: ${userId}`);
      
      return result.rows.map(row => ({
        id: row.id,
        user_id: row.user_id,
        bundle_program_id: row.bundle_program_id,
        item_name: row.item_name,
        description: row.description,
        merchant_id: row.merchant_id,
        original_quantity: row.original_quantity,
        remaining_quantity: row.remaining_quantity,
        expires_at: row.expires_at,
        created_at: row.created_at,
        last_used_at: row.last_used_at,
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
      this.logger.error(`Error finding bundles for user ${userId}:`, error.message);
      throw error;
    }
  }

  async createBundle(userId: string, bundleProgramId: string, quantity: number, expiresAt: Date | null): Promise<Bundle> {
    this.logger.log(`Creating bundle for user: ${userId}`);
    
    const query = `
      INSERT INTO bundle (
        user_id, 
        bundle_program_id, 
        item_name,
        description,
        merchant_id,
        original_quantity, 
        remaining_quantity, 
        expires_at
      )
      SELECT 
        $1 as user_id,
        $2 as bundle_program_id,
        bp.item_name,
        bp.description,
        bp.merchant_id,
        $3 as original_quantity,
        $4 as remaining_quantity,
        $5 as expires_at
      FROM bundle_program bp
      WHERE bp.id = $2
      RETURNING *
    `;
    
    const values = [
      userId,
      bundleProgramId,
      quantity,
      quantity,
      expiresAt
    ];
    
    try {
      const result = await this.pool.query(query, values);
      const bundle = result.rows[0];
      this.logger.log(`Created bundle: ${bundle.id}`);
      return bundle;
    } catch (error: any) {
      this.logger.error(`Error creating bundle for user ${userId}:`, error.message);
      throw error;
    }
  }

  async updateBundleQuantity(bundleId: string, newRemainingQuantity: number): Promise<Bundle> {
    this.logger.log(`Updating bundle ${bundleId} remaining quantity to: ${newRemainingQuantity}`);
    
    const now = new Date();
    
    const query = `
      UPDATE bundle 
      SET 
        remaining_quantity = $1,
        last_used_at = $2
      WHERE id = $3
      RETURNING *
    `;
    
    try {
      const result = await this.pool.query(query, [newRemainingQuantity, now, bundleId]);
      
      if (result.rows.length === 0) {
        throw new Error(`Bundle ${bundleId} not found`);
      }
      
      const bundle = result.rows[0];
      this.logger.log(`Updated bundle ${bundleId} remaining quantity to: ${bundle.remaining_quantity}`);
      return bundle;
    } catch (error: any) {
      this.logger.error(`Error updating bundle ${bundleId}:`, error.message);
      throw error;
    }
  }

  async createBundleUsage(bundleId: string, quantityUsed: number): Promise<void> {
    this.logger.log(`Recording bundle usage for bundle: ${bundleId}`);
    
    const query = `
      INSERT INTO bundle_usage (bundle_id, quantity_used)
      VALUES ($1, $2)
    `;
    
    try {
      await this.pool.query(query, [bundleId, quantityUsed]);
      this.logger.log(`Recorded bundle usage for bundle: ${bundleId}`);
    } catch (error: any) {
      this.logger.error(`Error recording bundle usage for bundle ${bundleId}:`, error.message);
      throw error;
    }
  }
} 