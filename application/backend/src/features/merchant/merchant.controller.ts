import { Controller, Get, Param, ParseUUIDPipe, Post, Body, HttpException, HttpStatus, Put, Delete, Query } from '@nestjs/common';
import { LoyaltyProgramDto, MerchantUserLoginDto, MerchantLoginResponse, CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto, MerchantDto, CreateMerchantDto, UpdateMerchantDto, FileUploadUrlDto, FileUploadResponseDto, MerchantUserDto, CreateMerchantUserDto, UpdateMerchantUserDto, UserDto, PunchCardDto, BundleProgramDto, BundleDto } from 'e-punch-common-core';
import { MerchantService } from './merchant.service';
import { BundleProgramService } from '../bundle-program/bundle-program.service';
import { Auth, RequireMerchantUser } from '../../core/decorators/security.decorators';
import { Authentication } from '../../core/types/authentication.interface';

@Controller('merchants')
export class MerchantController {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly bundleProgramService: BundleProgramService,
  ) {}

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

  @Get(':merchantId/bundle-programs')
  async getMerchantBundlePrograms(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
  ): Promise<BundleProgramDto[]> {
    return this.bundleProgramService.getMerchantBundlePrograms(merchantId);
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

  @Get(':merchantId/customers')
  async getMerchantCustomers(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<{ customers: UserDto[]; total: number; page: number; limit: number }> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.merchantService.getMerchantCustomers(merchantId, pageNum, limitNum, search, sortBy, sortOrder);
  }

  @Get(':merchantId/customers/:customerId')
  async getMerchantCustomer(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<UserDto> {
    return this.merchantService.getMerchantCustomer(merchantId, customerId);
  }

  @Get(':merchantId/customers/:customerId/punch-cards')
  async getMerchantCustomerPunchCards(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<PunchCardDto[]> {
    return this.merchantService.getMerchantCustomerPunchCards(merchantId, customerId);
  }

  @Get(':merchantId/customers/:customerId/bundles')
  @RequireMerchantUser()
  async getMerchantCustomerBundles(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Auth() auth: Authentication,
  ): Promise<BundleDto[]> {
    return this.merchantService.getMerchantCustomerBundles(merchantId, customerId, auth);
  }

} 