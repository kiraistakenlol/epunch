import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { AdminLoginResponse } from 'e-punch-common-core';

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async validateAdmin(login: string, password: string): Promise<AdminLoginResponse | null> {
    this.logger.log(`Validating admin user with login: ${login}`);

    try {
      if (login === 'admin' && password === '0000') {
        const payload = {
          sub: 'admin-user',
          email: 'admin@epunch.io',
          login: login,
          superAdmin: true,
          type: 'admin'
        };
        
        const token = this.jwtService.sign(payload);

        this.logger.log(`Admin authenticated successfully: ${login}`);

        return { token };
      }

      this.logger.warn(`Invalid admin credentials for login: ${login}`);
      return null;

    } catch (error: any) {
      this.logger.error(`Error validating admin ${login}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 