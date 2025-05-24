import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { PunchCardsModule } from './features/punch-cards/punch-cards.module';
import { UserModule } from './features/user/user.module';
import { DevModule } from './features/dev/dev.module';
import { DatabaseModule } from './database/database.module';
import { LoyaltyModule } from './features/loyalty/loyalty.module';
import { PunchesModule } from './features/punches/punches.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    PunchCardsModule,
    PunchesModule,
    UserModule,
    DevModule,
    LoyaltyModule,
    WebSocketModule,
  ],
})
export class AppModule {} 