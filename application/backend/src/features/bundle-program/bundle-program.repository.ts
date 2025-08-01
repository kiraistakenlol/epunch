import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { BundleProgramCreateDto, BundleProgramUpdateDto } from 'e-punch-common-core';

export interface BundleProgram {
  id: string;
  merchant_id: string;
  name: string;
  item_name: string;
  description: string | null;
  quantity_presets: any;
  is_active: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

@Injectable()
export class BundleProgramRepository {
  private readonly logger = new Logger(BundleProgramRepository.name);

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findBundleProgramsByMerchantId(merchantId: string): Promise<BundleProgram[]> {
    this.logger.log(`Finding bundle programs for merchant: ${merchantId}`);
    
    const query = 'SELECT * FROM bundle_program WHERE merchant_id = $1 AND is_deleted = false ORDER BY created_at DESC';
    
    try {
      const result = await this.pool.query(query, [merchantId]);
      this.logger.log(`Found ${result.rows.length} bundle programs for merchant: ${merchantId}`);
      return result.rows;
    } catch (error: any) {
      this.logger.error(`Error fetching bundle programs for merchant ${merchantId}:`, error.message);
      throw error;
    }
  }

  async findBundleProgramById(id: string): Promise<BundleProgram | null> {
    this.logger.log(`Finding bundle program by id: ${id}`);
    
    const query = 'SELECT * FROM bundle_program WHERE id = $1 AND is_deleted = false';
    
    try {
      const result = await this.pool.query(query, [id]);
      
      if (!result.rows[0]) {
        this.logger.warn(`No bundle program found with id: ${id}`);
        return null;
      }
      
      this.logger.log(`Found bundle program: ${id}`);
      return result.rows[0];
    } catch (error: any) {
      this.logger.error(`Error fetching bundle program ${id}:`, error.message);
      throw error;
    }
  }

  async getBundleProgramById(id: string): Promise<BundleProgram> {
    this.logger.log(`Getting bundle program by ID: ${id}`);
    
    const bundleProgram = await this.findBundleProgramById(id);
    
    if (!bundleProgram) {
      this.logger.error(`Bundle program with ID ${id} not found`);
      throw new NotFoundException(`Bundle program with ID ${id} not found`);
    }
    
    return bundleProgram;
  }

  async createBundleProgram(merchantId: string, data: BundleProgramCreateDto): Promise<BundleProgram> {
    this.logger.log(`Creating bundle program for merchant: ${merchantId}`);
    
    const query = `
      INSERT INTO bundle_program (merchant_id, name, item_name, description, quantity_presets, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      merchantId,
      data.name,
      data.itemName,
      data.description || null,
      JSON.stringify(data.quantityPresets),
      data.isActive ?? true
    ];
    
    try {
      const result = await this.pool.query(query, values);
      const bundleProgram = result.rows[0];
      this.logger.log(`Created bundle program: ${bundleProgram.id}`);
      return bundleProgram;
    } catch (error: any) {
      this.logger.error(`Error creating bundle program for merchant ${merchantId}:`, error.message);
      throw error;
    }
  }

  async updateBundleProgram(merchantId: string, programId: string, data: BundleProgramUpdateDto): Promise<BundleProgram | null> {
    this.logger.log(`Updating bundle program ${programId} for merchant: ${merchantId}`);
    
    const setParts: string[] = ['updated_at = NOW()'];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      setParts.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.itemName !== undefined) {
      setParts.push(`item_name = $${paramIndex++}`);
      values.push(data.itemName);
    }
    if (data.description !== undefined) {
      setParts.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.quantityPresets !== undefined) {
      setParts.push(`quantity_presets = $${paramIndex++}`);
      values.push(JSON.stringify(data.quantityPresets));
    }
    if (data.isActive !== undefined) {
      setParts.push(`is_active = $${paramIndex++}`);
      values.push(data.isActive);
    }

    if (setParts.length === 1) { // Only updated_at
      const programs = await this.findBundleProgramsByMerchantId(merchantId);
      return programs.find(p => p.id === programId) || null;
    }

    const query = `
      UPDATE bundle_program 
      SET ${setParts.join(', ')}
      WHERE id = $${paramIndex++} AND merchant_id = $${paramIndex++} AND is_deleted = false
      RETURNING *
    `;
    
    values.push(programId, merchantId);
    
    try {
      const result = await this.pool.query(query, values);
      
      if (result.rows.length === 0) {
        this.logger.warn(`Bundle program ${programId} not found for merchant ${merchantId}`);
        return null;
      }
      
      const bundleProgram = result.rows[0];
      this.logger.log(`Updated bundle program: ${programId}`);
      return bundleProgram;
    } catch (error: any) {
      this.logger.error(`Error updating bundle program ${programId}:`, error.message);
      throw error;
    }
  }

  async softDeleteBundleProgram(merchantId: string, programId: string): Promise<boolean> {
    this.logger.log(`Soft deleting bundle program ${programId} for merchant: ${merchantId}`);
    
    const query = `
      UPDATE bundle_program 
      SET is_deleted = true, deleted_at = NOW()
      WHERE id = $1 AND merchant_id = $2 AND is_deleted = false
    `;
    
    try {
      const result = await this.pool.query(query, [programId, merchantId]);
      const deleted = (result.rowCount ?? 0) > 0;
      
      if (deleted) {
        this.logger.log(`Soft deleted bundle program: ${programId}`);
      } else {
        this.logger.warn(`Bundle program ${programId} not found for merchant ${merchantId}`);
      }
      
      return deleted;
    } catch (error: any) {
      this.logger.error(`Error soft deleting bundle program ${programId}:`, error.message);
      throw error;
    }
  }
} 