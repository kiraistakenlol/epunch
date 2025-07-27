import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { BundleProgramService } from './bundle-program.service';
import { BundleProgramDto, BundleProgramCreateDto, BundleProgramUpdateDto } from 'e-punch-common-core';
import { RequireMerchantUser, Auth } from '../../core/decorators/security.decorators';
import { Authentication } from '../../core/types/authentication.interface';

@Controller('bundle-programs')
export class BundleProgramController {
  constructor(private readonly bundleProgramService: BundleProgramService) {}

  @Post()
  @RequireMerchantUser()
  async createBundleProgram(
    @Body() createDto: BundleProgramCreateDto,
    @Auth() auth: Authentication,
  ): Promise<BundleProgramDto> {
    const merchantId = auth.merchantUser!.merchantId;
    return this.bundleProgramService.createBundleProgram(merchantId, createDto);
  }

  @Put(':programId')
  @RequireMerchantUser()
  async updateBundleProgram(
    @Param('programId', ParseUUIDPipe) programId: string,
    @Body() updateDto: BundleProgramUpdateDto,
    @Auth() auth: Authentication,
  ): Promise<BundleProgramDto> {
    const merchantId = auth.merchantUser!.merchantId;
    return this.bundleProgramService.updateBundleProgram(merchantId, programId, updateDto);
  }

  @Delete(':programId')
  @RequireMerchantUser()
  async deleteBundleProgram(
    @Param('programId', ParseUUIDPipe) programId: string,
    @Auth() auth: Authentication,
  ): Promise<void> {
    const merchantId = auth.merchantUser!.merchantId;
    return this.bundleProgramService.deleteBundleProgram(merchantId, programId);
  }
} 