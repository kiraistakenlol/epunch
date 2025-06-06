import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PunchCardDto, UserDto } from 'e-punch-common-core';
import { User } from '../../core/decorators/current-user.decorator';
import { CurrentUser } from '../../core/types/current-user.interface';
import { PunchCardsService } from '../punch-cards/punch-cards.service';
import { UserRepository } from './user.repository';
import { UserMapper } from '../../mappers';

@Controller('users')
export class UserController {
  constructor(
    private readonly punchCardsService: PunchCardsService,
    private readonly userRepository: UserRepository,
  ) {}
  
  @Get()
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.findAllUsers();
    return UserMapper.toDtoArray(users);
  }

  @Get('me')
  async getCurrentUser(@User(true) user: CurrentUser): Promise<UserDto> {
    return {
      id: user.id,
      email: user.email,
      superAdmin: user.superAdmin
    };
  }

  @Get(':userId')
  async getUserById(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserDto> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return UserMapper.toDto(user);
  }

  @Get(':userId/punch-cards')
  async getUserPunchCards(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PunchCardDto[]> {
    return this.punchCardsService.getUserPunchCards(userId);
  }
} 