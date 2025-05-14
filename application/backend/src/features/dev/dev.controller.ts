import { Controller, Get, Post, Body, HttpStatus } from '@nestjs/common';
import { DevService } from './dev.service';

@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Get('status')
  async checkStatus() {
    return this.devService.getStatus();
  }

  @Post('generate-data')
  async generateTestData() {
    return this.devService.generateTestData();
  }

  @Post('reset-data')
  async resetTestData() {
    return this.devService.resetTestData();
  }
} 