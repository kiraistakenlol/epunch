import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppConfigModule } from './config/config.module';
import { ConfigModule } from '@nestjs/config';
import { PunchCardsModule } from './features/punch-cards/punch-cards.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule,
    SupabaseModule,
    PunchCardsModule,
  ],
  controllers: [AppController],
})
export class AppModule {} 