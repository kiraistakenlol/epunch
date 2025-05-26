import { Controller, Get } from '@nestjs/common';
import { UserDto } from 'e-punch-common-core';
import { User } from '../../core/decorators/current-user.decorator';
import { CurrentUser } from '../../core/types/current-user.interface';

@Controller('users')
export class UserController {
  @Get('me')
  async getCurrentUser(@User(true) user: CurrentUser): Promise<UserDto> {
    return {
      id: user.id,
      email: user.email
    };
  }
} 