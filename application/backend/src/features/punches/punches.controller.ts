import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PunchesService } from './punches.service';
import { CreatePunchDto, PunchOperationResultDto } from 'e-punch-common-core';

@Controller('punches')
export class PunchesController {
  constructor(private readonly punchesService: PunchesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPunch(
    @Body() createPunchDto: CreatePunchDto,
  ): Promise<PunchOperationResultDto> {
    return this.punchesService.recordPunch(createPunchDto);
  }
} 