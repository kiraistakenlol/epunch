import { Controller, Get, Post, Body, HttpStatus, Delete, Query } from '@nestjs/common';
import { DevService } from './dev.service';

@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Get('status')
  async checkStatus() {
    return this.devService.getStatus();
  }

  @Delete('punch-cards')
  async removeAllPunchCards(@Query('merchantId') merchantId?: string) {
    return this.devService.removeAllPunchCards(merchantId);
  }

  @Delete('users')
  async removeAllUsers(@Query('merchantId') merchantId?: string) {
    return this.devService.removeAllUsers(merchantId);
  }

  @Delete('loyalty-programs')
  async removeAllLoyaltyPrograms(@Query('merchantId') merchantId?: string) {
    return this.devService.removeAllLoyaltyPrograms(merchantId);
  }

  @Delete('merchants')
  async removeAllMerchants(@Query('merchantId') merchantId?: string) {
    return this.devService.removeAllMerchants(merchantId);
  }

  @Delete('all')
  async removeAllData(@Query('merchantId') merchantId?: string) {
    return this.devService.removeAllData(merchantId);
  }
} 