import { Controller, Get, Post, Put, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { PunchCardStyleDto, CreatePunchCardStyleDto, UpdatePunchCardStyleDto } from 'e-punch-common-core';
import { PunchCardStyleService } from './punch-card-style.service';

@Controller('punch-card-styles')
export class PunchCardStyleController {
  constructor(private readonly punchCardStyleService: PunchCardStyleService) {}

  @Get('merchants/:merchantId/default')
  async getMerchantDefaultStyle(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
  ): Promise<PunchCardStyleDto> {
    return this.punchCardStyleService.getMerchantDefaultStyle(merchantId);
  }

  @Post('merchants/:merchantId/default')
  async createOrUpdateMerchantDefaultStyle(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() data: CreatePunchCardStyleDto,
  ): Promise<PunchCardStyleDto> {
    return this.punchCardStyleService.createOrUpdateMerchantDefaultStyle(merchantId, data);
  }

  @Put('merchants/:merchantId/default/logo')
  async updateMerchantDefaultLogo(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() body: { logoUrl: string },
  ): Promise<PunchCardStyleDto> {
    return this.punchCardStyleService.updateMerchantDefaultLogo(merchantId, body.logoUrl);
  }

  @Get('loyalty-programs/:loyaltyProgramId')
  async getLoyaltyProgramStyle(
    @Param('loyaltyProgramId', ParseUUIDPipe) loyaltyProgramId: string,
  ): Promise<PunchCardStyleDto> {
    return this.punchCardStyleService.getLoyaltyProgramStyle(loyaltyProgramId);
  }

  @Post('loyalty-programs/:loyaltyProgramId')
  async createOrUpdateLoyaltyProgramStyle(
    @Param('loyaltyProgramId', ParseUUIDPipe) loyaltyProgramId: string,
    @Body() data: CreatePunchCardStyleDto,
  ): Promise<PunchCardStyleDto> {
    return this.punchCardStyleService.createOrUpdateLoyaltyProgramStyle(loyaltyProgramId, data);
  }

  @Put('loyalty-programs/:loyaltyProgramId')
  async updateLoyaltyProgramStyle(
    @Param('loyaltyProgramId', ParseUUIDPipe) loyaltyProgramId: string,
    @Body() data: UpdatePunchCardStyleDto,
  ): Promise<PunchCardStyleDto> {
    return this.punchCardStyleService.createOrUpdateLoyaltyProgramStyle(loyaltyProgramId, data);
  }
} 