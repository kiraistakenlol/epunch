export interface AuthRequestDto {
  authToken: string;
  userId: string;
}

import { UserDto } from './user.dto';

export interface AuthResponseDto {
  user: UserDto;
} 