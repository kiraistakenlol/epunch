import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PunchCardDto } from 'e-punch-common';
import { PunchCardsService } from './punch-cards.service';

@Controller('users/:userId/punch-cards')
export class PunchCardsController {
  constructor(private readonly punchCardsService: PunchCardsService) {}

  @Get()
  async getUserPunchCards(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PunchCardDto[]> {
    return this.punchCardsService.getUserPunchCards(userId);
  }
} 