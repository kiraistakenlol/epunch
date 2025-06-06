import { Module } from '@nestjs/common';
import { LoyaltyRepository } from './loyalty.repository';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyController } from './loyalty.controller';
import { MerchantModule } from '../merchant/merchant.module';

@Module({
  imports: [MerchantModule],
  controllers: [LoyaltyController],
  providers: [LoyaltyRepository, LoyaltyService],
  exports: [LoyaltyRepository, LoyaltyService],
})
export class LoyaltyModule {} 