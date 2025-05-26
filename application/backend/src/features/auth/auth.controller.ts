import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequestDto, AuthResponseDto, ApiResponse } from 'e-punch-common-core';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post()
  async auth(@Body() authRequest: AuthRequestDto): Promise<AuthResponseDto> {
    return await this.authService.authenticateUser(authRequest);
  }
} 