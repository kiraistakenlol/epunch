import { Controller, Get, Param, ParseUUIDPipe, Post, Body, HttpException, HttpStatus, Put, Delete } from '@nestjs/common';
import { LoyaltyProgramDto, MerchantLoginDto, MerchantLoginResponse, CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto } from 'e-punch-common-core';
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

  @Post(':merchantId/loyalty-programs')
  async createLoyaltyProgram(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() createDto: CreateLoyaltyProgramDto,
  ): Promise<LoyaltyProgramDto> {
    return this.merchantService.createLoyaltyProgram(merchantId, createDto);
  }

  @Put(':merchantId/loyalty-programs/:id')
  async updateLoyaltyProgram(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('id', ParseUUIDPipe) programId: string,
    @Body() updateDto: UpdateLoyaltyProgramDto,
  ): Promise<LoyaltyProgramDto> {
    return this.merchantService.updateLoyaltyProgram(merchantId, programId, updateDto);
  }

  @Delete(':merchantId/loyalty-programs/:id')
  async deleteLoyaltyProgram(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('id', ParseUUIDPipe) programId: string,
  ): Promise<void> {
    return this.merchantService.deleteLoyaltyProgram(merchantId, programId);
  }
} 