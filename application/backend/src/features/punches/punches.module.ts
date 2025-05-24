import { Module } from '@nestjs/common';
import { PunchesController } from './punches.controller';
import { PunchesService } from './punches.service';
import { PunchCardsModule } from '../punch-cards/punch-cards.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { UserModule } from '../user/user.module';
import { WebSocketModule } from '../../websocket/websocket.module';

@Module({
  imports: [
    PunchCardsModule,
    LoyaltyModule,
    UserModule,
    WebSocketModule,
  ],
  controllers: [PunchesController],
  providers: [PunchesService],
})
export class PunchesModule {} 