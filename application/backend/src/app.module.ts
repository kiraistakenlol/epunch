import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppConfigModule } from './config/config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Merchant, LoyaltyProgram, PunchCard, Punch } from './database/entities';
import { PunchCardsModule } from './features/punch-cards/punch-cards.module';

@Module({
  imports: [
    AppConfigModule, // Ensures ConfigService is available
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here to use ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('TypeOrmModule');
        logger.log(
          `Initializing database connection: host=${configService.get(
            'database.host',
          )}, port=${configService.get(
            'database.port',
          )}, dbname=${configService.get('database.database')}`,
        );
        return {
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          ssl: configService.get<boolean>('database.sslEnabled')
            ? { rejectUnauthorized: false }
            : false,
          entities: [User, Merchant, LoyaltyProgram, PunchCard, Punch],
          synchronize: false, // IMPORTANT: Schema is managed by DDL script
        };
      },
    }),
    PunchCardsModule,
  ],
  controllers: [AppController],
})
export class AppModule {} 