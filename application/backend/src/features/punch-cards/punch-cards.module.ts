import { Module } from '@nestjs/common';
import { PunchCardsController } from './punch-cards.controller';

@Module({
  controllers: [PunchCardsController],
  // providers: [], // Add PunchCardsService here later
})
export class PunchCardsModule {} 