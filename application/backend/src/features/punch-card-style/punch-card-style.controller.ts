import { Controller, Get, Post, Put, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { PunchCardStyleDto } from 'e-punch-common-core';
import { PunchCardStyleService } from './punch-card-style.service';

@Controller('punch-card-styles')
export class PunchCardStyleController {
  constructor(private readonly punchCardStyleService: PunchCardStyleService) {}

  @Get('merchants/:merchantId/default')
  async getMerchantDefaultStyle(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
  ): Promise<PunchCardStyleDto> {
    const style = await this.punchCardStyleService.getMerchantDefaultStyle(merchantId);
    if (style) {
      return style;
    }
    return this.punchCardStyleService.getDefaultAppStyle();
  }

  @Post('merchants/:merchantId/default')
  async createOrUpdateMerchantDefaultStyle(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() data: PunchCardStyleDto,
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

  @Get('loyalty-programs/:loyaltyProgramId/merchants/:merchantId')
  async getLoyaltyProgramStyle(
    @Param('loyaltyProgramId', ParseUUIDPipe) loyaltyProgramId: string,
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
  ): Promise<PunchCardStyleDto> {
    const loyaltyStyle = await this.punchCardStyleService.getLoyaltyProgramStyle(loyaltyProgramId, merchantId);
    if (loyaltyStyle) {
      return loyaltyStyle;
    }
    
    const merchantStyle = await this.punchCardStyleService.getMerchantDefaultStyle(merchantId);
    if (merchantStyle) {
      return merchantStyle;
    }
    
    return this.punchCardStyleService.getDefaultAppStyle();
  }

  @Post('loyalty-programs/:loyaltyProgramId/merchants/:merchantId')
  async createOrUpdateLoyaltyProgramStyle(
    @Param('loyaltyProgramId', ParseUUIDPipe) loyaltyProgramId: string,
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() data: PunchCardStyleDto,
  ): Promise<PunchCardStyleDto> {
    return this.punchCardStyleService.createOrUpdateLoyaltyProgramStyle(loyaltyProgramId, merchantId, data);
  }

  @Put('loyalty-programs/:loyaltyProgramId/merchants/:merchantId')
  async updateLoyaltyProgramStyle(
    @Param('loyaltyProgramId', ParseUUIDPipe) loyaltyProgramId: string,
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() data: PunchCardStyleDto,
  ): Promise<PunchCardStyleDto> {
    return this.punchCardStyleService.createOrUpdateLoyaltyProgramStyle(loyaltyProgramId, merchantId, data);
  }
} 