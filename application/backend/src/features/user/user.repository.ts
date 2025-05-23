import { Injectable, Logger, Inject } from '@nestjs/common';
import { Pool } from 'pg';

export interface User {
  id: string;
  created_at: Date;
}

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findUserById(id: string): Promise<User | null> {
    this.logger.log(`Attempting to find user with id: ${id}`);
    
    const query = 'SELECT * FROM "user" WHERE id = $1';
    
    try {
      const result = await this.pool.query(query, [id]);
      
      if (!result.rows[0]) {
        this.logger.warn(`No user found with id: ${id}`);
        return null;
      }
      
      this.logger.log(`Successfully found user with id: ${id}`);
      return result.rows[0];
    } catch (error: any) {
      this.logger.error(`Error fetching user with id ${id}:`, error.message);
      return null;
    }
  }

  async createUserWithId(id: string): Promise<User> {
    this.logger.log(`Attempting to create a new user with id: ${id}`);
    
    const query = 'INSERT INTO "user" (id) VALUES ($1) RETURNING *';
    
    try {
      const result = await this.pool.query(query, [id]);
      
      if (!result.rows[0]) {
        throw new Error(`Failed to create user with id ${id}: No data returned`);
      }
      
      this.logger.log(`Successfully created user with id: ${result.rows[0].id}`);
      return result.rows[0];
    } catch (error: any) {
      throw new Error(`Failed to create user with id ${id}: ${error.message}`);
    }
  }
} 