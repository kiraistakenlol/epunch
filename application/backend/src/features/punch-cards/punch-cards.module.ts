import { Module } from '@nestjs/common';
import { PunchCardsController } from './punch-cards.controller';
import { PunchCardsService } from './punch-cards.service';
import { PunchCardsRepository } from './punch-cards.repository';
import { WebSocketModule } from '../../websocket/websocket.module';
import { UserRepository } from '../user/user.repository';
import { MerchantModule } from '../merchant/merchant.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';

@Module({
  imports: [WebSocketModule, MerchantModule, LoyaltyModule],
  controllers: [PunchCardsController],
  providers: [PunchCardsService, PunchCardsRepository, UserRepository],
  exports: [PunchCardsService, PunchCardsRepository]
})
export class PunchCardsModule {} 