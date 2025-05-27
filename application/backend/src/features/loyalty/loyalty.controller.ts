import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { LoyaltyService } from './loyalty.service';

@Controller('loyalty-programs')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get(':id')
  async getLoyaltyProgram(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LoyaltyProgramDto> {
    return this.loyaltyService.getLoyaltyProgram(id);
  }
} 