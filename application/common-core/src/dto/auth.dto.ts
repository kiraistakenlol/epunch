export interface AuthRequestDto {
  authToken: string; // JWT token from cognito
  userId: string;
}

import { UserDto } from './user.dto';

export interface AuthResponseDto {
  user: UserDto;
} 