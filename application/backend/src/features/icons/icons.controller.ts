import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { IconsService } from './icons.service';
import { IconSearchResultDto } from 'e-punch-common-core';

@Controller('icons')
export class IconsController {
  constructor(private readonly iconsService: IconsService) {}

  @Get('search')
  async searchIcons(
    @Query('q') query?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 50,
  ): Promise<IconSearchResultDto> {
    return this.iconsService.searchIcons(query, page, limit);
  }
} 