import { Controller, Get, Post, Body, HttpStatus, Delete } from '@nestjs/common';
import { DevService } from './dev.service';

@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Get('status')
  async checkStatus() {
    return this.devService.getStatus();
  }

  @Delete('punch-cards')
  async removeAllPunchCards() {
    return this.devService.removeAllPunchCards();
  }

  @Delete('users')
  async removeAllUsers() {
    return this.devService.removeAllUsers();
  }

  @Delete('loyalty-programs')
  async removeAllLoyaltyPrograms() {
    return this.devService.removeAllLoyaltyPrograms();
  }

  @Delete('merchants')
  async removeAllMerchants() {
    return this.devService.removeAllMerchants();
  }

  @Delete('all')
  async removeAllData() {
    return this.devService.removeAllData();
  }
} 