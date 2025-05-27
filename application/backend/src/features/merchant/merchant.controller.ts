import { Controller, Get, Param, ParseUUIDPipe, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LoyaltyProgramDto, MerchantLoginDto, MerchantLoginResponse } from 'e-punch-common-core';
import { MerchantService } from './merchant.service';

@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post('auth')
  async login(@Body() loginDto: MerchantLoginDto): Promise<MerchantLoginResponse> {
    try {
      const result = await this.merchantService.validateMerchant(
        loginDto.login,
        loginDto.password
      );

      if (!result) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Authentication failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':merchantId/loyalty-programs')
  async getMerchantLoyaltyPrograms(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
  ): Promise<LoyaltyProgramDto[]> {
    return this.merchantService.getMerchantLoyaltyPrograms(merchantId);
  }
} 