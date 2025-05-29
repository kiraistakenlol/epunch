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




  async removeAllPunchCards(): Promise<DevResponse> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        
        const punchResult = await client.query('DELETE FROM punch');
        const punchCardResult = await client.query('DELETE FROM punch_card');
        
        await client.query('COMMIT');
        
        return {
          status: 'success',
          message: 'All punch cards and punches removed successfully',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
          },
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

  async removeAllUsers(): Promise<DevResponse> {
    try {
      const client = await this.pool.connect();
      let deletedCognitoUsers = 0;
      
      try {
        await client.query('BEGIN');
        
        const users = await client.query('SELECT external_id FROM "user" WHERE external_id IS NOT NULL');
        
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
        
        const punchResult = await client.query('DELETE FROM punch');
        const punchCardResult = await client.query('DELETE FROM punch_card');
        const userResult = await client.query('DELETE FROM "user"');
        
        await client.query('COMMIT');
        
        return {
          status: 'success',
          message: 'All users removed successfully from database and Cognito',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
            users: userResult.rowCount,
            cognitoUsers: deletedCognitoUsers,
          },
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

  async removeAllLoyaltyPrograms(): Promise<DevResponse> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        
        const punchResult = await client.query('DELETE FROM punch');
        const punchCardResult = await client.query('DELETE FROM punch_card');
        const loyaltyProgramResult = await client.query('DELETE FROM loyalty_program');
        
        await client.query('COMMIT');
        
        return {
          status: 'success',
          message: 'All loyalty programs removed successfully',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
            loyaltyPrograms: loyaltyProgramResult.rowCount,
          },
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

  async removeAllMerchants(): Promise<DevResponse> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        
        const punchResult = await client.query('DELETE FROM punch');
        const punchCardResult = await client.query('DELETE FROM punch_card');
        const loyaltyProgramResult = await client.query('DELETE FROM loyalty_program');
        const merchantResult = await client.query('DELETE FROM merchant');
        
        await client.query('COMMIT');
        
        return {
          status: 'success',
          message: 'All merchants removed successfully',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
            loyaltyPrograms: loyaltyProgramResult.rowCount,
            merchants: merchantResult.rowCount,
          },
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

  async removeAllData(): Promise<DevResponse> {
    try {
      const client = await this.pool.connect();
      let deletedCognitoUsers = 0;
      
      try {
        await client.query('BEGIN');
        
        const users = await client.query('SELECT external_id FROM "user" WHERE external_id IS NOT NULL');
        
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
        
        const punchResult = await client.query('DELETE FROM punch');
        const punchCardResult = await client.query('DELETE FROM punch_card');
        const loyaltyProgramResult = await client.query('DELETE FROM loyalty_program');
        const merchantResult = await client.query('DELETE FROM merchant');
        const userResult = await client.query('DELETE FROM "user"');
        
        await client.query('COMMIT');
        
        return {
          status: 'success',
          message: 'All data removed successfully from database and Cognito',
          deletedCounts: {
            punches: punchResult.rowCount,
            punchCards: punchCardResult.rowCount,
            loyaltyPrograms: loyaltyProgramResult.rowCount,
            merchants: merchantResult.rowCount,
            users: userResult.rowCount,
            cognitoUsers: deletedCognitoUsers,
          },
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