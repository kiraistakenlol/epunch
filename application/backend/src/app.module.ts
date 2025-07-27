import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './features/auth/auth.module';
import { PunchCardsModule } from './features/punch-cards/punch-cards.module';
import { UserModule } from './features/user/user.module';
import { DevModule } from './features/dev/dev.module';
import { DatabaseModule } from './database/database.module';
import { LoyaltyModule } from './features/loyalty/loyalty.module';
import { WebSocketModule } from './websocket/websocket.module';
import { MerchantModule } from './features/merchant/merchant.module';
import { PunchCardStyleModule } from './features/punch-card-style/punch-card-style.module';
import { IconsModule } from './features/icons/icons.module';
import { AdminModule } from './features/admin/admin.module';
import { AnalyticsModule } from './features/analytics/analytics.module';
import { BundleProgramModule } from './features/bundle-program/bundle-program.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    CoreModule,
    AuthModule,
    AdminModule,
    AnalyticsModule,
    BundleProgramModule,
    PunchCardsModule,
    UserModule,
    DevModule,
    LoyaltyModule,
    MerchantModule,
    PunchCardStyleModule,
    IconsModule,
    WebSocketModule,
  ],
})
export class AppModule {} 