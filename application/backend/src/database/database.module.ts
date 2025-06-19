import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_POOL',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        
        const poolConfig = {
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          database: configService.get<string>('database.name'),
          user: configService.get<string>('database.user'),
          password: configService.get<string>('database.password'),
          ssl: { rejectUnauthorized: false },
          max: 10,
          min: 2,
          idleTimeoutMillis: 10000,
          connectionTimeoutMillis: 10000,
          acquireTimeoutMillis: 60000,
          createTimeoutMillis: 30000,
          destroyTimeoutMillis: 5000,
          reapIntervalMillis: 1000,
          createRetryIntervalMillis: 200,
          propagateCreateError: false,
        };

        logger.log('Database pool config:', JSON.stringify({
          host: poolConfig.host,
          port: poolConfig.port,
          database: poolConfig.database,
          user: poolConfig.user,
          ssl: poolConfig.ssl,
          max: poolConfig.max
        }, null, 2));
        
        const pool = new Pool(poolConfig);

        pool.on('error', (err) => {
          logger.error('Unexpected error on idle client', err);
        });

        pool.on('connect', (client) => {
          logger.log('New client connected to database');
        });

        pool.on('remove', (client) => {
          logger.log('Client removed from pool');
        });

        const connectWithRetry = async (retries = 3): Promise<Pool> => {
          for (let i = 0; i < retries; i++) {
            try {
              logger.log(`Testing database connection (attempt ${i + 1}/${retries})...`);
              const client = await pool.connect();
              const result = await client.query('SELECT NOW()');
              client.release();
              
              logger.log(`Database connection successful! Server time: ${result.rows[0].now}`);
              logger.log(`Connected to database: ${configService.get<string>('database.name')} at ${configService.get<string>('database.host')}:${configService.get<number>('database.port')}`);
              
              return pool;
            } catch (error: any) {
              logger.error(`Connection attempt ${i + 1} failed: ${error.message}`);
              if (i === retries - 1) {
                throw error;
              }
              await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
            }
          }
          throw new Error('All connection attempts failed');
        };

        try {
          return await connectWithRetry();
        } catch (error: any) {
          logger.error('Failed to connect to database after retries:', error.message);
          logger.error(`Database config: {
            host: ${poolConfig.host},
            port: ${poolConfig.port},
            database: ${poolConfig.database},
            user: ${poolConfig.user}
          }`);
          await pool.end();
          throw new Error(`Database connection failed: ${error.message}`);
        }
      },
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {} 