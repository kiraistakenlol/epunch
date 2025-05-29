import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { LoyaltyService } from './loyalty.service';

@Controller('loyalty-programs')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get()
  async getLoyaltyPrograms(
    @Query('ids') ids: string,
  ): Promise<LoyaltyProgramDto[]> {
    const idArray = ids.split(',').map(id => id.trim());
    return this.loyaltyService.getLoyaltyPrograms(idArray);
  }

  @Get(':id')
  async getLoyaltyProgram(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LoyaltyProgramDto> {
    return this.loyaltyService.getLoyaltyProgram(id);
  }
} 