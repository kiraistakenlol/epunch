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

  async findLoyaltyProgramsByIds(ids: string[]): Promise<LoyaltyProgram[]> {
    if (ids.length === 0) return [];
    
    this.logger.log(`Attempting to find loyalty programs with ids: ${ids.join(', ')}`);
    
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');
    const query = `SELECT * FROM loyalty_program WHERE id IN (${placeholders})`;
    
    try {
      const result = await this.pool.query(query, ids);
      
      this.logger.log(`Successfully found ${result.rows.length} loyalty programs`);
      return result.rows;
    } catch (error: any) {
      this.logger.error(`Error fetching loyalty programs with ids ${ids.join(', ')}:`, error.message);
      return [];
    }
  }

} 