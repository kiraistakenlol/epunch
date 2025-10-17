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

  async removeAllPunchCards(merchantId?: string): Promise<DevResponse> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        
        let punchResult, punchCardResult;
        
        if (merchantId) {
          punchResult = await client.query(`
            DELETE FROM punch 
            WHERE punch_card_id IN (
              SELECT pc.id FROM punch_card pc 
              JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id 
              WHERE lp.merchant_id = $1
            )
          `, [merchantId]);
          
          punchCardResult = await client.query(`
            DELETE FROM punch_card 
            WHERE loyalty_program_id IN (
              SELECT id FROM loyalty_program WHERE merchant_id = $1
            )
          `, [merchantId]);
        } else {
          punchResult = await client.query('DELETE FROM punch');
          punchCardResult = await client.query('DELETE FROM punch_card');
        }
        
        await client.query('COMMIT');
        
        return {
          status: 'success',
          message: merchantId 
            ? `All punch cards and punches for merchant ${merchantId} removed successfully`
            : 'All punch cards and punches removed successfully',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
          },
          merchantId: merchantId || null,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Failed to remove punch cards',
        error: error.message,
      };
    }
  }

  async removeAllUsers(merchantId?: string): Promise<DevResponse> {
    try {
      const client = await this.pool.connect();

      try {
        await client.query('BEGIN');

        let punchResult, punchCardResult, userResult;

        if (merchantId) {
          punchResult = await client.query(`
            DELETE FROM punch
            WHERE punch_card_id IN (
              SELECT pc.id FROM punch_card pc
              JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
              WHERE lp.merchant_id = $1
            )
          `, [merchantId]);

          punchCardResult = await client.query(`
            DELETE FROM punch_card
            WHERE loyalty_program_id IN (
              SELECT id FROM loyalty_program WHERE merchant_id = $1
            )
          `, [merchantId]);

          userResult = await client.query(`
            DELETE FROM "user"
            WHERE id IN (
              SELECT DISTINCT u.id
              FROM "user" u
              JOIN punch_card pc ON u.id = pc.user_id
              JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
              WHERE lp.merchant_id = $1
            )
          `, [merchantId]);
        } else {
          punchResult = await client.query('DELETE FROM punch');
          punchCardResult = await client.query('DELETE FROM punch_card');
          userResult = await client.query('DELETE FROM "user"');
        }

        await client.query('COMMIT');

        return {
          status: 'success',
          message: merchantId
            ? `All users for merchant ${merchantId} removed successfully from database`
            : 'All users removed successfully from database',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
            users: userResult.rowCount,
          },
          merchantId: merchantId || null,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Failed to remove users',
        error: error.message,
      };
    }
  }

  async removeAllLoyaltyPrograms(merchantId?: string): Promise<DevResponse> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        
        let punchResult, punchCardResult, loyaltyProgramResult;
        
        if (merchantId) {
          punchResult = await client.query(`
            DELETE FROM punch 
            WHERE punch_card_id IN (
              SELECT pc.id FROM punch_card pc 
              JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id 
              WHERE lp.merchant_id = $1
            )
          `, [merchantId]);
          
          punchCardResult = await client.query(`
            DELETE FROM punch_card 
            WHERE loyalty_program_id IN (
              SELECT id FROM loyalty_program WHERE merchant_id = $1
            )
          `, [merchantId]);
          
          loyaltyProgramResult = await client.query(`
            DELETE FROM loyalty_program WHERE merchant_id = $1
          `, [merchantId]);
        } else {
          punchResult = await client.query('DELETE FROM punch');
          punchCardResult = await client.query('DELETE FROM punch_card');
          loyaltyProgramResult = await client.query('DELETE FROM loyalty_program');
        }
        
        await client.query('COMMIT');
        
        return {
          status: 'success',
          message: merchantId 
            ? `All loyalty programs for merchant ${merchantId} removed successfully`
            : 'All loyalty programs removed successfully',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
            loyaltyPrograms: loyaltyProgramResult.rowCount,
          },
          merchantId: merchantId || null,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Failed to remove loyalty programs',
        error: error.message,
      };
    }
  }

  async removeAllMerchants(merchantId?: string): Promise<DevResponse> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        
        let punchResult, punchCardResult, loyaltyProgramResult, merchantResult;
        
        if (merchantId) {
          punchResult = await client.query(`
            DELETE FROM punch 
            WHERE punch_card_id IN (
              SELECT pc.id FROM punch_card pc 
              JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id 
              WHERE lp.merchant_id = $1
            )
          `, [merchantId]);
          
          punchCardResult = await client.query(`
            DELETE FROM punch_card 
            WHERE loyalty_program_id IN (
              SELECT id FROM loyalty_program WHERE merchant_id = $1
            )
          `, [merchantId]);
          
          loyaltyProgramResult = await client.query(`
            DELETE FROM loyalty_program WHERE merchant_id = $1
          `, [merchantId]);
          
          merchantResult = await client.query(`
            DELETE FROM merchant WHERE id = $1
          `, [merchantId]);
        } else {
          punchResult = await client.query('DELETE FROM punch');
          punchCardResult = await client.query('DELETE FROM punch_card');
          loyaltyProgramResult = await client.query('DELETE FROM loyalty_program');
          merchantResult = await client.query('DELETE FROM merchant');
        }
        
        await client.query('COMMIT');
        
        return {
          status: 'success',
          message: merchantId 
            ? `Merchant ${merchantId} removed successfully`
            : 'All merchants removed successfully',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
            loyaltyPrograms: loyaltyProgramResult.rowCount,
            merchants: merchantResult.rowCount,
          },
          merchantId: merchantId || null,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Failed to remove merchants',
        error: error.message,
      };
    }
  }

  async removeAllData(merchantId?: string): Promise<DevResponse> {
    try {
      const client = await this.pool.connect();

      try {
        await client.query('BEGIN');

        let punchResult, punchCardResult, loyaltyProgramResult, merchantResult, userResult;

        if (merchantId) {
          punchResult = await client.query(`
            DELETE FROM punch
            WHERE punch_card_id IN (
              SELECT pc.id FROM punch_card pc
              JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
              WHERE lp.merchant_id = $1
            )
          `, [merchantId]);

          punchCardResult = await client.query(`
            DELETE FROM punch_card
            WHERE loyalty_program_id IN (
              SELECT id FROM loyalty_program WHERE merchant_id = $1
            )
          `, [merchantId]);

          loyaltyProgramResult = await client.query(`
            DELETE FROM loyalty_program WHERE merchant_id = $1
          `, [merchantId]);

          merchantResult = await client.query(`
            DELETE FROM merchant WHERE id = $1
          `, [merchantId]);

          userResult = await client.query(`
            DELETE FROM "user"
            WHERE id IN (
              SELECT DISTINCT u.id
              FROM "user" u
              JOIN punch_card pc ON u.id = pc.user_id
              JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id
              WHERE lp.merchant_id = $1
            )
          `, [merchantId]);
        } else {
          punchResult = await client.query('DELETE FROM punch');
          punchCardResult = await client.query('DELETE FROM punch_card');
          loyaltyProgramResult = await client.query('DELETE FROM loyalty_program');
          merchantResult = await client.query('DELETE FROM merchant');
          userResult = await client.query('DELETE FROM "user"');
        }

        await client.query('COMMIT');

        return {
          status: 'success',
          message: merchantId
            ? `All data for merchant ${merchantId} removed successfully from database`
            : 'All data removed successfully from database',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
            loyaltyPrograms: loyaltyProgramResult.rowCount,
            merchants: merchantResult.rowCount,
            users: userResult.rowCount,
          },
          merchantId: merchantId || null,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Failed to remove all data',
        error: error.message,
      };
    }
  }

  async getSystemStatistics(): Promise<{
    merchants: { total: number; list: Array<{ id: string; name: string; punchCardCount: number; userCount: number; loyaltyProgramCount: number }> };
    users: { total: number };
    punchCards: { total: number; active: number; rewardReady: number; redeemed: number };
    punches: { total: number };
    loyaltyPrograms: { total: number; active: number };
  }> {
    try {
      const client = await this.pool.connect();
      
      try {
        const merchantsQuery = await client.query(`
          SELECT 
            m.id,
            m.name,
            COUNT(DISTINCT pc.id) as punch_card_count,
            COUNT(DISTINCT pc.user_id) as user_count,
            COUNT(DISTINCT lp.id) as loyalty_program_count
          FROM merchant m
          LEFT JOIN loyalty_program lp ON m.id = lp.merchant_id
          LEFT JOIN punch_card pc ON lp.id = pc.loyalty_program_id
          GROUP BY m.id, m.name
          ORDER BY m.name
        `);

        const totalUsersQuery = await client.query('SELECT COUNT(*) as count FROM "user"');
        
        const punchCardsQuery = await client.query(`
          SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active,
            COUNT(CASE WHEN status = 'REWARD_READY' THEN 1 END) as reward_ready,
            COUNT(CASE WHEN status = 'REWARD_REDEEMED' THEN 1 END) as redeemed
          FROM punch_card
        `);

        const punchesQuery = await client.query('SELECT COUNT(*) as count FROM punch');
        
        const loyaltyProgramsQuery = await client.query(`
          SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN is_active = true THEN 1 END) as active
          FROM loyalty_program
        `);

        const merchantsList = merchantsQuery.rows.map(row => ({
          id: row.id,
          name: row.name,
          punchCardCount: parseInt(row.punch_card_count) || 0,
          userCount: parseInt(row.user_count) || 0,
          loyaltyProgramCount: parseInt(row.loyalty_program_count) || 0,
        }));

        const punchCardStats = punchCardsQuery.rows[0];
        const loyaltyProgramStats = loyaltyProgramsQuery.rows[0];

        return {
          merchants: {
            total: merchantsList.length,
            list: merchantsList,
          },
          users: {
            total: parseInt(totalUsersQuery.rows[0].count) || 0,
          },
          punchCards: {
            total: parseInt(punchCardStats.total) || 0,
            active: parseInt(punchCardStats.active) || 0,
            rewardReady: parseInt(punchCardStats.reward_ready) || 0,
            redeemed: parseInt(punchCardStats.redeemed) || 0,
          },
          punches: {
            total: parseInt(punchesQuery.rows[0].count) || 0,
          },
          loyaltyPrograms: {
            total: parseInt(loyaltyProgramStats.total) || 0,
            active: parseInt(loyaltyProgramStats.active) || 0,
          },
        };
      } finally {
        client.release();
      }
    } catch (err) {
      const error = err as Error;
      throw new Error(`Failed to get system statistics: ${error.message}`);
    }
  }
} 