import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CognitoIdentityProviderClient, ListUsersCommand, AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider';

interface DevResponse {
  status: string;
  message: string;
  [key: string]: any;
}

@Injectable()
export class DevService {
  private cognitoClient: CognitoIdentityProviderClient;
  private userPoolId: string;

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.userPoolId = process.env.AWS_COGNITO_USER_POOL_ID!;
  }

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
      let deletedCognitoUsers = 0;
      
      try {
        await client.query('BEGIN');
        
        let users;
        if (merchantId) {
          users = await client.query(`
            SELECT DISTINCT u.external_id 
            FROM "user" u 
            JOIN punch_card pc ON u.id = pc.user_id 
            JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id 
            WHERE lp.merchant_id = $1 AND u.external_id IS NOT NULL
          `, [merchantId]);
        } else {
          users = await client.query('SELECT external_id FROM "user" WHERE external_id IS NOT NULL');
        }
        
        for (const user of users.rows) {
          try {
            await this.cognitoClient.send(new AdminDeleteUserCommand({
              UserPoolId: this.userPoolId,
              Username: user.external_id,
            }));
            deletedCognitoUsers++;
          } catch (cognitoError) {
            console.warn(`Failed to delete Cognito user ${user.external_id}:`, cognitoError);
          }
        }
        
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
            ? `All users for merchant ${merchantId} removed successfully from database and Cognito`
            : 'All users removed successfully from database and Cognito',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
            users: userResult.rowCount,
            cognitoUsers: deletedCognitoUsers,
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
      let deletedCognitoUsers = 0;
      
      try {
        await client.query('BEGIN');
        
        let users;
        if (merchantId) {
          users = await client.query(`
            SELECT DISTINCT u.external_id 
            FROM "user" u 
            JOIN punch_card pc ON u.id = pc.user_id 
            JOIN loyalty_program lp ON pc.loyalty_program_id = lp.id 
            WHERE lp.merchant_id = $1 AND u.external_id IS NOT NULL
          `, [merchantId]);
        } else {
          users = await client.query('SELECT external_id FROM "user" WHERE external_id IS NOT NULL');
        }
        
        for (const user of users.rows) {
          try {
            await this.cognitoClient.send(new AdminDeleteUserCommand({
              UserPoolId: this.userPoolId,
              Username: user.external_id,
            }));
            deletedCognitoUsers++;
          } catch (cognitoError) {
            console.warn(`Failed to delete Cognito user ${user.external_id}:`, cognitoError);
          }
        }
        
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
            ? `All data for merchant ${merchantId} removed successfully from database and Cognito`
            : 'All data removed successfully from database and Cognito',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
            loyaltyPrograms: loyaltyProgramResult.rowCount,
            merchants: merchantResult.rowCount,
            users: userResult.rowCount,
            cognitoUsers: deletedCognitoUsers,
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
} 