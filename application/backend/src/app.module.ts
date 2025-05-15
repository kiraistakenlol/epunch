import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppConfigModule } from './config/config.module';
import { ConfigModule } from '@nestjs/config';
import { PunchCardsModule } from './features/punch-cards/punch-cards.module';
import { SupabaseModule } from './supabase/supabase.module';
import { DevModule } from './features/dev/dev.module';
import { PunchesModule } from './features/punches/punches.module';
import { LoyaltyModule } from './features/loyalty/loyalty.module';
import { UserModule } from './features/user/user.module';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule,
    SupabaseModule,
    PunchCardsModule,
    PunchesModule,
    LoyaltyModule,
    UserModule,
    DevModule,
  ],
  controllers: [AppController],
})
export class AppModule {} 