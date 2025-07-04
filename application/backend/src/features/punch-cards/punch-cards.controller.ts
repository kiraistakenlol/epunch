import { Controller, Get, Param, ParseUUIDPipe, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PunchCardDto, CreatePunchCardDto, CreatePunchDto, PunchOperationResultDto } from 'e-punch-common-core';
import { PunchCardsService } from './punch-cards.service';
import { RequireMerchantUser, Auth } from '../../core/decorators/security.decorators';
import { Authentication } from '../../core/types/authentication.interface';

@Controller('punch-cards')
export class PunchCardsController {
  constructor(private readonly punchCardsService: PunchCardsService) {}

  @Post()
  async createPunchCard(@Body() createPunchCardDto: CreatePunchCardDto): Promise<PunchCardDto> {
    return this.punchCardsService.createPunchCard(createPunchCardDto.userId, createPunchCardDto.loyaltyProgramId);
  }

  @Post('punch')
  @HttpCode(HttpStatus.CREATED)
  @RequireMerchantUser()
  async recordPunch(
    @Body() createPunchDto: CreatePunchDto,
    @Auth() auth: Authentication,
  ): Promise<PunchOperationResultDto> {
    return this.punchCardsService.recordPunch(createPunchDto, auth);
  }

  @Get(':punchCardId')
  async getPunchCard(
    @Param('punchCardId', ParseUUIDPipe) punchCardId: string,
  ): Promise<PunchCardDto> {
    return this.punchCardsService.getPunchCard(punchCardId);
  }

  @Post(':punchCardId/redeem')
  @RequireMerchantUser()
  async redeemPunchCard(
    @Param('punchCardId', ParseUUIDPipe) punchCardId: string,
    @Auth() auth: Authentication,
  ): Promise<PunchCardDto> {
    return this.punchCardsService.redeemPunchCard(punchCardId, auth);
  }
} 