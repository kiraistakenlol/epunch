import { Controller, Get, Post, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { BenefitCardService } from './benefit-card.service';
import { BenefitCardDto, BenefitCardCreateDto } from 'e-punch-common-core';
import { RequireMerchantUser, Auth } from '../../core/decorators/security.decorators';
import { Authentication } from '../../core/types/authentication.interface';

@Controller('benefit-cards')
export class BenefitCardController {
  constructor(private readonly benefitCardService: BenefitCardService) {}

  @Get(':benefitCardId')
  @RequireMerchantUser()
  async getBenefitCardById(
    @Param('benefitCardId', ParseUUIDPipe) benefitCardId: string,
    @Auth() auth: Authentication,
  ): Promise<BenefitCardDto> {
    return this.benefitCardService.getBenefitCardById(benefitCardId, auth);
  }

  @Post()
  @RequireMerchantUser()
  async createBenefitCard(
    @Body() createDto: BenefitCardCreateDto,
    @Auth() auth: Authentication,
  ): Promise<BenefitCardDto> {
    return this.benefitCardService.createBenefitCard(createDto, auth);
  }
}