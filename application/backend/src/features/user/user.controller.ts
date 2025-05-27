import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PunchCardDto, UserDto } from 'e-punch-common-core';
import { User } from '../../core/decorators/current-user.decorator';
import { CurrentUser } from '../../core/types/current-user.interface';
import { PunchCardsService } from '../punch-cards/punch-cards.service';

@Controller('users')
export class UserController {
  constructor(private readonly punchCardsService: PunchCardsService) {}
  
  @Get('me')
  async getCurrentUser(@User(true) user: CurrentUser): Promise<UserDto> {
    return {
      id: user.id,
      email: user.email
    };
  }

  @Get(':userId/punch-cards')
  async getUserPunchCards(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PunchCardDto[]> {
    return this.punchCardsService.getUserPunchCards(userId);
  }
} 