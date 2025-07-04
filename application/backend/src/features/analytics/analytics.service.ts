import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QuickOverviewDto, UsersAnalyticsDto, CardsAnalyticsDto, GrowthTrendsDto, ActivityTrendsDto, DaysOfWeekAnalyticsDto, LoyaltyProgramAnalyticsDto } from 'e-punch-common-core';
import { AnalyticsRepository } from './analytics.repository';
import { MerchantService } from '../merchant/merchant.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly analyticsRepository: AnalyticsRepository,
    private readonly merchantService: MerchantService,
  ) {}

  async getQuickOverview(merchantId: string): Promise<QuickOverviewDto> {
    this.logger.log(`Fetching quick overview for merchant: ${merchantId}`);

    const merchant = await this.merchantService.getMerchantById(merchantId);
    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
    }

    return this.analyticsRepository.getQuickOverview(merchantId);
  }

  async getUsersAnalytics(merchantId: string): Promise<UsersAnalyticsDto> {
    this.logger.log(`Fetching users analytics for merchant: ${merchantId}`);

    const merchant = await this.merchantService.getMerchantById(merchantId);
    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
    }

    return this.analyticsRepository.getUsersAnalytics(merchantId);
  }

  async getCardsAnalytics(merchantId: string): Promise<CardsAnalyticsDto> {
    this.logger.log(`Fetching cards analytics for merchant: ${merchantId}`);

    const merchant = await this.merchantService.getMerchantById(merchantId);
    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
    }

    return this.analyticsRepository.getCardsAnalytics(merchantId);
  }

  async getGrowthTrends(merchantId: string, timeUnit: 'days' | 'weeks' | 'months', programId?: string): Promise<GrowthTrendsDto> {
    this.logger.log(`Fetching growth trends for merchant: ${merchantId}, timeUnit: ${timeUnit}, programId: ${programId}`);

    const merchant = await this.merchantService.getMerchantById(merchantId);
    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
    }

    return this.analyticsRepository.getGrowthTrends(merchantId, timeUnit, programId);
  }

  async getActivityTrends(merchantId: string, timeUnit: 'days' | 'weeks' | 'months', programId?: string): Promise<ActivityTrendsDto> {
    this.logger.log(`Fetching activity trends for merchant: ${merchantId}, timeUnit: ${timeUnit}, programId: ${programId}`);

    const merchant = await this.merchantService.getMerchantById(merchantId);
    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
    }

    return this.analyticsRepository.getActivityTrends(merchantId, timeUnit, programId);
  }

  async getDaysOfWeekAnalytics(merchantId: string, programId?: string): Promise<DaysOfWeekAnalyticsDto> {
    this.logger.log(`Fetching days of week analytics for merchant: ${merchantId}, programId: ${programId}`);

    const merchant = await this.merchantService.getMerchantById(merchantId);
    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
    }

    return this.analyticsRepository.getDaysOfWeekAnalytics(merchantId, programId);
  }

  async getLoyaltyProgramAnalytics(merchantId: string): Promise<LoyaltyProgramAnalyticsDto> {
    this.logger.log(`Fetching loyalty program analytics for merchant: ${merchantId}`);

    const merchant = await this.merchantService.getMerchantById(merchantId);
    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
    }

    return this.analyticsRepository.getLoyaltyProgramAnalytics(merchantId);
  }
} 