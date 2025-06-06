import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './features/auth/auth.module';
import { PunchCardsModule } from './features/punch-cards/punch-cards.module';
import { UserModule } from './features/user/user.module';
import { DevModule } from './features/dev/dev.module';
import { DatabaseModule } from './database/database.module';
import { LoyaltyModule } from './features/loyalty/loyalty.module';
import { PunchesModule } from './features/punches/punches.module';
import { WebSocketModule } from './websocket/websocket.module';
import { MerchantModule } from './features/merchant/merchant.module';
import { PunchCardStyleModule } from './features/punch-card-style/punch-card-style.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    CoreModule,
    AuthModule,
    PunchCardsModule,
    PunchesModule,
    UserModule,
    DevModule,
    LoyaltyModule,
    MerchantModule,
    PunchCardStyleModule,
    WebSocketModule,
  ],
})
export class AppModule {} 