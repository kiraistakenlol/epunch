import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AdminLoginDto, AdminLoginResponse } from 'e-punch-common-core';
import { AdminAuthService } from './admin-auth.service';

@Controller('admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('auth')
  async login(@Body() loginDto: AdminLoginDto): Promise<AdminLoginResponse> {
    try {
      const result = await this.adminAuthService.validateAdmin(
        loginDto.login,
        loginDto.password
      );

      if (!result) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Authentication failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 