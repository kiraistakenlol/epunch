export interface AuthRequestDto {
  googleCode: string;
  userId: string;
}

import { UserDto } from './user.dto';

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token: string;
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
} 