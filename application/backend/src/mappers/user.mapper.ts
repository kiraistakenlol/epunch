import { UserDto } from 'e-punch-common-core';
import { User } from '../features/user/user.repository';

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email || '',
      superAdmin: user.super_admin || false,
      externalId: user.external_id,
      createdAt: user.created_at.toISOString(),
    };
  }

  static toDtoArray(users: User[]): UserDto[] {
    return users.map(user => this.toDto(user));
  }
} 