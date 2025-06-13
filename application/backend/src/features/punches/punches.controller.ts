import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PunchCardsService } from '../punch-cards/punch-cards.service';
import { CreatePunchDto, PunchOperationResultDto } from 'e-punch-common-core';

@Controller('punches')
export class PunchesController {
  constructor(private readonly punchCardsService: PunchCardsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPunch(
    @Body() createPunchDto: CreatePunchDto,
  ): Promise<PunchOperationResultDto> {
    return this.punchCardsService.recordPunch(createPunchDto);
  }
} 