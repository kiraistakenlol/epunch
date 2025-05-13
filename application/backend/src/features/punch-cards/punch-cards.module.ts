import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PunchCardsController } from './punch-cards.controller';
import { PunchCardsService } from './punch-cards.service';
import { PunchCardsRepository } from './punch-cards.repository';
import { PunchCard, LoyaltyProgram, Merchant } from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([PunchCard, LoyaltyProgram, Merchant])
  ],
  controllers: [PunchCardsController],
  providers: [PunchCardsService, PunchCardsRepository],
  exports: [PunchCardsService]
})
export class PunchCardsModule {} 