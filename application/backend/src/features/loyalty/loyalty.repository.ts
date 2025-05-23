import { Injectable, Logger, Inject } from '@nestjs/common';
import { Pool } from 'pg';

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

@Injectable()
export class LoyaltyRepository {
  private readonly logger = new Logger(LoyaltyRepository.name);

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findLoyaltyProgramById(id: string): Promise<LoyaltyProgram | null> {
    this.logger.log(`Attempting to find loyalty program with id: ${id}`);
    
    const query = 'SELECT * FROM loyalty_program WHERE id = $1';
    
    try {
      const result = await this.pool.query(query, [id]);
      
      if (!result.rows[0]) {
        this.logger.warn(`No loyalty program found with id: ${id}`);
        return null;
      }
      
      this.logger.log(`Successfully found loyalty program with id: ${id}`);
      return result.rows[0];
    } catch (error: any) {
      this.logger.error(`Error fetching loyalty program with id ${id}:`, error.message);
      return null;
    }
  }

  async findMerchantById(id: string): Promise<Merchant | null> {
    this.logger.log(`Attempting to find merchant with id: ${id}`);
    
    const query = 'SELECT * FROM merchant WHERE id = $1';
    
    try {
      const result = await this.pool.query(query, [id]);
      
      if (!result.rows[0]) {
        this.logger.warn(`No merchant found with id: ${id}`);
        return null;
      }
      
      this.logger.log(`Successfully found merchant with id: ${id}`);
      return result.rows[0];
    } catch (error: any) {
      this.logger.error(`Error fetching merchant with id ${id}:`, error.message);
      return null;
    }
  }
} 