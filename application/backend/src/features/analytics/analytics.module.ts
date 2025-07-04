import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './analytics.repository';
import { MerchantModule } from '../merchant/merchant.module';

@Module({
  imports: [MerchantModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository],
  exports: [AnalyticsService, AnalyticsRepository]
})
export class AnalyticsModule {} 