import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PunchCardDto } from 'e-punch-common-core';
import { PunchCardsService } from './punch-cards.service';

@Controller('punch-cards')
export class PunchCardsController {
  constructor(private readonly punchCardsService: PunchCardsService) {}

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