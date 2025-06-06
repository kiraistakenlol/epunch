import { Module } from '@nestjs/common';
import { PunchCardStyleController } from './punch-card-style.controller';
import { PunchCardStyleService } from './punch-card-style.service';
import { PunchCardStyleRepository } from './punch-card-style.repository';
import { PunchCardsModule } from '../punch-cards/punch-cards.module';
import { MerchantRepository } from '../merchant/merchant.repository';

@Module({
  imports: [PunchCardsModule],
  controllers: [PunchCardStyleController],
  providers: [PunchCardStyleService, PunchCardStyleRepository, MerchantRepository],
  exports: [PunchCardStyleService, PunchCardStyleRepository],
})
export class PunchCardStyleModule {} 