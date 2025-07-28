import { Controller, Get, Post, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { BundleDto, BundleCreateDto, BundleUseDto } from 'e-punch-common-core';
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

  @Post(':bundleId/use')
  @RequireMerchantUser()
  async useBundle(
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Body() bundleUseDto: BundleUseDto,
    @Auth() auth: Authentication,
  ): Promise<BundleDto> {
    return this.bundleService.useBundle(bundleId, bundleUseDto, auth);
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