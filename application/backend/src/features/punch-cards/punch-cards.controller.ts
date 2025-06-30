import { Controller, Get, Param, ParseUUIDPipe, Post, Body } from '@nestjs/common';
import { PunchCardDto, CreatePunchCardDto } from 'e-punch-common-core';
import { PunchCardsService } from './punch-cards.service';

@Controller('punch-cards')
export class PunchCardsController {
  constructor(private readonly punchCardsService: PunchCardsService) {}

  @Post()
  // todo we need to protect is somehow from overflooding database + clreading multiple similar punch cards
  async createPunchCard(@Body() createPunchCardDto: CreatePunchCardDto): Promise<PunchCardDto> {
    return this.punchCardsService.createPunchCard(createPunchCardDto.userId, createPunchCardDto.loyaltyProgramId);
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