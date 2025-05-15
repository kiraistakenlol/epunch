import { Module } from '@nestjs/common';
import { LoyaltyRepository } from './loyalty.repository';

@Module({
  providers: [LoyaltyRepository],
  exports: [LoyaltyRepository],
})
export class LoyaltyModule {} 