import { Injectable, Logger, Inject } from '@nestjs/common';
import { Pool } from 'pg';

export interface User {
  id: string;
  email?: string;
  external_id?: string;
  external_provider?: string;
  super_admin?: boolean;
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

  async findUserByExternalId(externalId: string): Promise<User | null> {
    this.logger.log(`Attempting to find user with external_id: ${externalId}`);
    
    const query = 'SELECT * FROM "user" WHERE external_id = $1';
    
    try {
      const result = await this.pool.query(query, [externalId]);
      
      if (!result.rows[0]) {
        this.logger.warn(`No user found with external_id: ${externalId}`);
        return null;
      }
      
      this.logger.log(`Successfully found user with external_id: ${externalId}`);
      return result.rows[0];
    } catch (error: any) {
      this.logger.error(`Error fetching user with external_id ${externalId}:`, error.message);
      return null;
    }
  }

  async createAnonymousUser(id: string): Promise<User> {
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

  async createUser(id: string, externalId: string, email: string): Promise<User> {
    this.logger.log(`Attempting to create a new user with external_id: ${externalId}`);
    
    const query = 'INSERT INTO "user" (id, external_id, email, external_provider) VALUES ($1, $2, $3, $4) RETURNING *';
    
    try {
      const result = await this.pool.query(query, [id, externalId, email, 'cognito']);
      
      if (!result.rows[0]) {
        throw new Error(`Failed to create user [external id: ${externalId}, email: ${email}, id: ${id}]: No data returned`);
      }
      
      this.logger.log(`Successfully created user
         [external id: ${result.rows[0].external_id}, email: ${result.rows[0].email}, id: ${result.rows[0].id}]`);
      return result.rows[0];
    } catch (error: any) {
      throw new Error(`Failed to create user [external id: ${externalId}, email: ${email}, id: ${id}]: ${error.message}`);
    }
  }

  async findAllUsers(): Promise<User[]> {
    this.logger.log('Fetching all users');
    
    const query = 'SELECT * FROM "user" ORDER BY created_at DESC';
    
    try {
      const result = await this.pool.query(query);
      this.logger.log(`Found ${result.rows.length} users`);
      return result.rows;
    } catch (error: any) {
      this.logger.error(`Error fetching all users: ${error.message}`);
      throw error;
    }
  }

  async findCustomersByMerchantId(
    merchantId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ customers: User[]; total: number }> {
    this.logger.log(`Fetching customers for merchant: ${merchantId}, page: ${page}, limit: ${limit}`);
    
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let orderClause = 'ORDER BY u.created_at DESC';
    const queryParams: (string | number)[] = [merchantId, limit, offset];
    let paramIndex = 4;
    
    if (search) {
      whereClause = `AND (u.email ILIKE $${paramIndex} OR u.id ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    if (sortBy && sortOrder) {
      const allowedSortColumns = ['email', 'created_at'];
      if (allowedSortColumns.includes(sortBy)) {
        orderClause = `ORDER BY u.${sortBy} ${sortOrder.toUpperCase()}`;
      }
    }
    
    const customerQuery = `
      SELECT DISTINCT u.* 
      FROM "user" u
      INNER JOIN punch_card pc ON u.id = pc.user_id
      INNER JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
      WHERE lp.merchant_id = $1
      ${whereClause}
      ${orderClause}
      LIMIT $2 OFFSET $3
    `;
    
    const countQuery = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM "user" u
      INNER JOIN punch_card pc ON u.id = pc.user_id
      INNER JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
      WHERE lp.merchant_id = $1
      ${whereClause}
    `;
    
    try {
      const countParams = search ? [merchantId, `%${search}%`] : [merchantId];
      const [customerResult, countResult] = await Promise.all([
        this.pool.query(customerQuery, queryParams),
        this.pool.query(countQuery, countParams)
      ]);
      
      const customers = customerResult.rows;
      const total = parseInt(countResult.rows[0]?.total || '0', 10);
      
      this.logger.log(`Found ${customers.length} customers for merchant: ${merchantId}`);
      return { customers, total };
    } catch (error: any) {
      this.logger.error(`Error fetching customers for merchant ${merchantId}: ${error.message}`);
      throw error;
    }
  }

  async findCustomerByMerchantAndId(merchantId: string, customerId: string): Promise<User | null> {
    this.logger.log(`Fetching customer ${customerId} for merchant: ${merchantId}`);
    
    const query = `
      SELECT DISTINCT u.* 
      FROM "user" u
      INNER JOIN punch_card pc ON u.id = pc.user_id
      INNER JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
      WHERE lp.merchant_id = $1 AND u.id = $2
    `;
    
    try {
      const result = await this.pool.query(query, [merchantId, customerId]);
      
      if (!result.rows[0]) {
        this.logger.warn(`No customer found with id: ${customerId} for merchant: ${merchantId}`);
        return null;
      }
      
      this.logger.log(`Successfully found customer ${customerId} for merchant: ${merchantId}`);
      return result.rows[0];
    } catch (error: any) {
      this.logger.error(`Error fetching customer ${customerId} for merchant ${merchantId}: ${error.message}`);
      throw error;
    }
  }

} 