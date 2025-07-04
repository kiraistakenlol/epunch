import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { QuickOverviewDto, UsersAnalyticsDto, CardsAnalyticsDto, GrowthTrendsDto, ActivityTrendsDto, DaysOfWeekAnalyticsDto, LoyaltyProgramAnalyticsDto } from 'e-punch-common-core';
import { AnalyticsService } from './analytics.service';

@Controller('analytics/:merchantId')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('quick-overview')
  async getQuickOverview(@Param('merchantId', ParseUUIDPipe) merchantId: string): Promise<QuickOverviewDto> {
    return this.analyticsService.getQuickOverview(merchantId);
  }

  @Get('users')
  async getUsersAnalytics(@Param('merchantId', ParseUUIDPipe) merchantId: string): Promise<UsersAnalyticsDto> {
    return this.analyticsService.getUsersAnalytics(merchantId);
  }

  @Get('cards')
  async getCardsAnalytics(@Param('merchantId', ParseUUIDPipe) merchantId: string): Promise<CardsAnalyticsDto> {
    return this.analyticsService.getCardsAnalytics(merchantId);
  }

  @Get('growth-trends')
  async getGrowthTrends(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Query('timeUnit') timeUnit: 'days' | 'weeks' | 'months',
    @Query('programId') programId?: string
  ): Promise<GrowthTrendsDto> {
    return this.analyticsService.getGrowthTrends(merchantId, timeUnit, programId);
  }

  @Get('activity-trends')
  async getActivityTrends(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Query('timeUnit') timeUnit: 'days' | 'weeks' | 'months',
    @Query('programId') programId?: string
  ): Promise<ActivityTrendsDto> {
    return this.analyticsService.getActivityTrends(merchantId, timeUnit, programId);
  }

  @Get('days-of-week')
  async getDaysOfWeekAnalytics(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Query('programId') programId?: string
  ): Promise<DaysOfWeekAnalyticsDto> {
    return this.analyticsService.getDaysOfWeekAnalytics(merchantId, programId);
  }

  @Get('loyalty-programs')
  async getLoyaltyProgramAnalytics(
    @Param('merchantId', ParseUUIDPipe) merchantId: string
  ): Promise<LoyaltyProgramAnalyticsDto> {
    return this.analyticsService.getLoyaltyProgramAnalytics(merchantId);
  }
} 