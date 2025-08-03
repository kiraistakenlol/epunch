import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PunchCardDto, UserDto, BundleDto, BenefitCardDto } from 'e-punch-common-core';
import { Auth, RequireEndUser, isEndUser } from '../../core/decorators/security.decorators';
import { Authentication } from '../../core/types/authentication.interface';
import { PunchCardsService } from '../punch-cards/punch-cards.service';
import { BundleService } from '../bundle/bundle.service';
import { BenefitCardService } from '../benefit-card/benefit-card.service';
import { UserRepository } from './user.repository';
import { UserMapper } from '../../mappers';

@Controller('users')
export class UserController {
  constructor(
    private readonly punchCardsService: PunchCardsService,
    private readonly bundleService: BundleService,
    private readonly benefitCardService: BenefitCardService,
    private readonly userRepository: UserRepository,
  ) {}
  
  @Get()
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.findAllUsers();
    return UserMapper.toDtoArray(users);
  }

  @Get('me')
  @RequireEndUser()
  async getCurrentUser(@Auth() auth: Authentication): Promise<UserDto> {
    if (!isEndUser(auth)) {
      throw new Error('End user authentication required');
    }
    
    return {
      id: auth.endUser.id,
      email: auth.endUser.email,
      superAdmin: auth.endUser.superAdmin
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

  @Get(':userId/bundles')
  async getUserBundles(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Auth() auth: Authentication,
  ): Promise<BundleDto[]> {
    console.log('getUserBundles', userId, auth);
    return this.bundleService.getUserBundles(userId, auth);
  }

  @Get(':userId/benefit-cards')
  async getUserBenefitCards(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Auth() auth: Authentication,
  ): Promise<BenefitCardDto[]> {
    return this.benefitCardService.getUserBenefitCards(userId, auth);
  }
} 