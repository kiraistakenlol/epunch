import { Controller, Get, Param, ParseUUIDPipe, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PunchCardDto, CreatePunchCardDto, CreatePunchDto, PunchOperationResultDto } from 'e-punch-common-core';
import { PunchCardsService } from './punch-cards.service';

@Controller('punch-cards')
export class PunchCardsController {
  constructor(private readonly punchCardsService: PunchCardsService) {}

  @Post()
  // todo we need to protect is somehow from overflooding database + clreading multiple similar punch cards
  async createPunchCard(@Body() createPunchCardDto: CreatePunchCardDto): Promise<PunchCardDto> {
    return this.punchCardsService.createPunchCard(createPunchCardDto.userId, createPunchCardDto.loyaltyProgramId);
  }

  @Post('punch')
  @HttpCode(HttpStatus.CREATED)
  async recordPunch(
    @Body() createPunchDto: CreatePunchDto,
  ): Promise<PunchOperationResultDto> {
    return this.punchCardsService.recordPunch(createPunchDto);
  }

  @Get(':punchCardId')
  async getPunchCard(
    @Param('punchCardId', ParseUUIDPipe) punchCardId: string,
  ): Promise<PunchCardDto> {
    return this.punchCardsService.getPunchCard(punchCardId);
  }

  @Post(':punchCardId/redeem')
  async redeemPunchCard(
    @Param('punchCardId', ParseUUIDPipe) punchCardId: string,
  ): Promise<PunchCardDto> {
    return this.punchCardsService.redeemPunchCard(punchCardId);
  }
} 