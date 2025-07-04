import { Controller, Get, Param, ParseUUIDPipe, Post, Body, HttpException, HttpStatus, Put, Delete, Query } from '@nestjs/common';
import { LoyaltyProgramDto, MerchantUserLoginDto, MerchantLoginResponse, CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto, MerchantDto, CreateMerchantDto, UpdateMerchantDto, FileUploadUrlDto, FileUploadResponseDto, MerchantUserDto, CreateMerchantUserDto, UpdateMerchantUserDto } from 'e-punch-common-core';
import { MerchantService } from './merchant.service';

@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get()
  async getAllMerchants(@Query('slug') slug?: string): Promise<MerchantDto[]> {
    if (slug) {
      const merchant = await this.merchantService.getMerchantBySlug(slug);
      return [merchant];
    }
    return this.merchantService.getAllMerchants();
  }

  @Get('by-slug/:slug')
  async getMerchantBySlug(
    @Param('slug') slug: string,
  ): Promise<MerchantDto> {
    return this.merchantService.getMerchantBySlug(slug);
  }

  @Get(':merchantId')
  async getMerchantById(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
  ): Promise<MerchantDto> {
    return this.merchantService.getMerchantById(merchantId);
  }

  @Post()
  async createMerchant(@Body() createDto: CreateMerchantDto): Promise<MerchantDto> {
    return this.merchantService.createMerchant(createDto);
  }

  @Put(':merchantId')
  async updateMerchant(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() updateDto: UpdateMerchantDto,
  ): Promise<MerchantDto> {
    return this.merchantService.updateMerchant(merchantId, updateDto);
  }

  @Delete(':merchantId')
  async deleteMerchant(@Param('merchantId', ParseUUIDPipe) merchantId: string): Promise<void> {
    return this.merchantService.deleteMerchant(merchantId);
  }

  @Post('auth')
  async login(@Body() loginDto: MerchantUserLoginDto): Promise<MerchantLoginResponse> {
    try {
      const result = await this.merchantService.validateMerchant(
        loginDto.merchantSlug,
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

  @Post(':merchantId/file-upload-url')
  async generateFileUploadUrl(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() fileUploadDto: FileUploadUrlDto,
  ): Promise<FileUploadResponseDto> {
    return this.merchantService.generateFileUploadUrl(merchantId, fileUploadDto);
  }

  @Get(':merchantId/users')
  async getMerchantUsers(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
  ): Promise<MerchantUserDto[]> {
    return this.merchantService.getMerchantUsers(merchantId);
  }

  @Post(':merchantId/users')
  async createMerchantUser(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() createDto: CreateMerchantUserDto,
  ): Promise<MerchantUserDto> {
    return this.merchantService.createMerchantUser(merchantId, createDto);
  }

  @Put(':merchantId/users/:userId')
  async updateMerchantUser(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateDto: UpdateMerchantUserDto,
  ): Promise<MerchantUserDto> {
    return this.merchantService.updateMerchantUser(merchantId, userId, updateDto);
  }

  @Delete(':merchantId/users/:userId')
  async deleteMerchantUser(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    return this.merchantService.deleteMerchantUser(merchantId, userId);
  }

} 