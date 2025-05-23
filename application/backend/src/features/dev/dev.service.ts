import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

interface DevResponse {
  status: string;
  message: string;
  [key: string]: any;
}

@Injectable()
export class DevService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async getStatus(): Promise<DevResponse> {
    try {
      const result = await this.pool.query('SELECT id FROM "user" LIMIT 5');
      
      return {
        status: 'success',
        message: 'Development API is active',
        dbConnection: 'ok',
        userSample: result.rows.map(user => user.id),
        userCount: result.rows.length,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Database connection error',
        error: error.message,
      };
    }
  }

  async generateTestData(): Promise<DevResponse> {
    try {
      return {
        status: 'info',
        message: 'Test data generation not implemented yet with PostgreSQL client',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Failed to generate test data',
        error: error.message,
      };
    }
  }

  async resetTestData(): Promise<DevResponse> {
    try {
      return {
        status: 'info',
        message: 'Test data reset not implemented yet with PostgreSQL client',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Failed to reset test data',
        error: error.message,
      };
    }
  }
} 