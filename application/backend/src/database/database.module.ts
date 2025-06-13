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
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
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

        try {
          logger.log('Testing database connection...');
          const client = await pool.connect();
          const result = await client.query('SELECT NOW()');
          client.release();
          
          logger.log(`Database connection successful! Server time: ${result.rows[0].now}`);
          logger.log(`Connected to database: ${configService.get<string>('database.name')} at ${configService.get<string>('database.host')}:${configService.get<number>('database.port')}`);
          
          return pool;
        } catch (error: any) {
          logger.error('Failed to connect to database:', error.message);
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