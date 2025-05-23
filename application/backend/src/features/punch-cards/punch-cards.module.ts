import { Module } from '@nestjs/common';
import { PunchCardsController } from './punch-cards.controller';
import { PunchCardsService } from './punch-cards.service';
import { PunchCardsRepository } from './punch-cards.repository';

@Module({
  controllers: [PunchCardsController],
  providers: [PunchCardsService, PunchCardsRepository],
  exports: [PunchCardsService, PunchCardsRepository]
})
export class PunchCardsModule {} 