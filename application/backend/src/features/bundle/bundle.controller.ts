import { Controller, Get, Post, Put, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { BundleDto, BundleCreateDto, BundleUpdateDto } from 'e-punch-common-core';
import { RequireMerchantUser, Auth } from '../../core/decorators/security.decorators';
import { Authentication } from '../../core/types/authentication.interface';

@Controller('bundles')
export class BundleController {
  constructor(private readonly bundleService: BundleService) {}

  @Get(':bundleId')
  @RequireMerchantUser()
  async getBundleById(
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Auth() auth: Authentication,
  ): Promise<BundleDto> {
    return this.bundleService.getBundleById(bundleId, auth);
  }

  @Put(':bundleId')
  @RequireMerchantUser()
  async updateBundle(
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Body() updateDto: BundleUpdateDto,
    @Auth() auth: Authentication,
  ): Promise<BundleDto> {
    return this.bundleService.updateBundle(bundleId, updateDto, auth);
  }

  @Post()
  @RequireMerchantUser()
  async createBundle(
    @Body() createDto: BundleCreateDto,
    @Auth() auth: Authentication,
  ): Promise<BundleDto> {
    return this.bundleService.createBundle(createDto, auth);
  }
} 