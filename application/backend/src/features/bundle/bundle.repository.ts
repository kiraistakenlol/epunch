import { Injectable, Logger, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BundleCreateDto } from 'e-punch-common-core';

export interface Bundle {
  id: string;
  user_id: string;
  bundle_program_id: string;
  original_quantity: number;
  remaining_quantity: number;
  expires_at: Date | null;
  created_at: Date;
  last_used_at: Date | null;
}

export interface BundleWithProgram extends Bundle {
  program_name: string;
  program_item_name: string;
  program_description: string | null;
  merchant_id: string;
  merchant_name: string;
  merchant_address: string | null;
}

@Injectable()
export class BundleRepository {
  private readonly logger = new Logger(BundleRepository.name);

  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findBundleById(bundleId: string): Promise<Bundle | null> {
    this.logger.log(`Finding bundle by ID: ${bundleId}`);
    
    const query = `
      SELECT * FROM bundle
      WHERE id = $1
    `;
    
    try {
      const result = await this.pool.query(query, [bundleId]);
      return result.rows[0] || null;
    } catch (error: any) {
      this.logger.error(`Error finding bundle by ID ${bundleId}:`, error.message);
      throw error;
    }
  }

  async findBundleWithProgramById(bundleId: string): Promise<BundleWithProgram | null> {
    this.logger.log(`Finding bundle with program details by ID: ${bundleId}`);
    
    const query = `
      SELECT 
        b.*,
        bp.name as program_name,
        bp.item_name as program_item_name,
        bp.description as program_description,
        bp.merchant_id,
        m.name as merchant_name,
        m.address as merchant_address
      FROM bundle b
      JOIN bundle_program bp ON b.bundle_program_id = bp.id
      JOIN merchant m ON bp.merchant_id = m.id
      WHERE b.id = $1
        AND bp.is_deleted = false
    `;
    
    try {
      const result = await this.pool.query(query, [bundleId]);
      return result.rows[0] || null;
    } catch (error: any) {
      this.logger.error(`Error finding bundle with program by ID ${bundleId}:`, error.message);
      throw error;
    }
  }

  async findUserBundles(userId: string): Promise<BundleWithProgram[]> {
    this.logger.log(`Finding bundles for user: ${userId}`);
    
    const query = `
      SELECT 
        b.*,
        bp.name as program_name,
        bp.item_name as program_item_name,
        bp.description as program_description,
        bp.merchant_id,
        m.name as merchant_name,
        m.address as merchant_address
      FROM bundle b
      JOIN bundle_program bp ON b.bundle_program_id = bp.id
      JOIN merchant m ON bp.merchant_id = m.id
      WHERE b.user_id = $1
        AND bp.is_deleted = false
        AND b.remaining_quantity > 0
      ORDER BY b.created_at DESC
    `;
    
    try {
      const result = await this.pool.query(query, [userId]);
      this.logger.log(`Found ${result.rows.length} bundles for user: ${userId}`);
      return result.rows;
    } catch (error: any) {
      this.logger.error(`Error finding bundles for user ${userId}:`, error.message);
      throw error;
    }
  }

  async createBundle(data: BundleCreateDto): Promise<Bundle> {
    this.logger.log(`Creating bundle for user: ${data.userId}`);
    
    const expiresAt = data.validityDays 
      ? new Date(Date.now() + data.validityDays * 24 * 60 * 60 * 1000)
      : null;
    
    const query = `
      INSERT INTO bundle (user_id, bundle_program_id, original_quantity, remaining_quantity, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      data.userId,
      data.bundleProgramId,
      data.quantity,
      data.quantity,
      expiresAt
    ];
    
    try {
      const result = await this.pool.query(query, values);
      const bundle = result.rows[0];
      this.logger.log(`Created bundle: ${bundle.id}`);
      return bundle;
    } catch (error: any) {
      this.logger.error(`Error creating bundle for user ${data.userId}:`, error.message);
      throw error;
    }
  }

  async useBundle(bundleId: string, quantityUsed: number = 1): Promise<Bundle> {
    this.logger.log(`Using bundle ${bundleId} with quantity: ${quantityUsed}`);
    
    const now = new Date();
    const query = `
      UPDATE bundle 
      SET 
        remaining_quantity = remaining_quantity - $1,
        last_used_at = $2
      WHERE id = $3
        AND remaining_quantity >= $1
      RETURNING *
    `;
    
    try {
      const result = await this.pool.query(query, [quantityUsed, now, bundleId]);
      
      if (result.rows.length === 0) {
        throw new Error(`Bundle ${bundleId} not found or insufficient quantity`);
      }
      
      const bundle = result.rows[0];
      this.logger.log(`Used bundle ${bundleId}. Remaining quantity: ${bundle.remaining_quantity}`);
      return bundle;
    } catch (error: any) {
      this.logger.error(`Error using bundle ${bundleId}:`, error.message);
      throw error;
    }
  }

  async createBundleUsage(bundleId: string, quantityUsed: number = 1): Promise<void> {
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