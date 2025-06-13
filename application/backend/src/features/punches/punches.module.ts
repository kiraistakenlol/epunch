import { Module } from '@nestjs/common';
import { PunchesController } from './punches.controller';
import { PunchCardsModule } from '../punch-cards/punch-cards.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { UserModule } from '../user/user.module';
import { WebSocketModule } from '../../websocket/websocket.module';
import { MerchantModule } from '../merchant/merchant.module';
import { PunchCardStyleModule } from '../punch-card-style/punch-card-style.module';

@Module({
  imports: [
    PunchCardsModule,
    LoyaltyModule,
    UserModule,
    WebSocketModule,
    MerchantModule,
    PunchCardStyleModule,
  ],
  controllers: [PunchesController],
  providers: [],
})
export class PunchesModule {} 