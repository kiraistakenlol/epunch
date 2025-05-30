import { Module } from '@nestjs/common';
import { PunchCardsController } from './punch-cards.controller';
import { PunchCardsService } from './punch-cards.service';
import { PunchCardsRepository } from './punch-cards.repository';
import { WebSocketModule } from '../../websocket/websocket.module';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [WebSocketModule],
  controllers: [PunchCardsController],
  providers: [PunchCardsService, PunchCardsRepository, UserRepository],
  exports: [PunchCardsService, PunchCardsRepository]
})
export class PunchCardsModule {} 