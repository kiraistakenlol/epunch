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
        
        const pool = new Pool({
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          database: configService.get<string>('database.name'),
          user: configService.get<string>('database.user'),
          password: configService.get<string>('database.password'),
          ssl: false,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });

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
            host: ${configService.get<string>('database.host')},
            port: ${configService.get<number>('database.port')},
            database: ${configService.get<string>('database.name')},
            user: ${configService.get<string>('database.user')}
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