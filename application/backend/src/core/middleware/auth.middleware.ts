import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { jwtVerify, decodeJwt } from 'jose';
import { UserRepository } from '../../features/user/user.repository';
import { MerchantUserRepository } from '../../features/merchant-user/merchant-user.repository';
import { Authentication, EndUserAuthentication, MerchantUserAuthentication } from '../types/authentication.interface';
import { JwtPayloadDto } from 'e-punch-common-core';

declare global {
  namespace Express {
    interface Request {
      authentication?: Authentication;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    private userRepository: UserRepository,
    private merchantUserRepository: MerchantUserRepository,
    private configService: ConfigService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const authentication: Authentication = {
      merchantUser: undefined,
      endUser: undefined,
      superAdmin: false
    };

    // Try to parse as admin token first
    const adminUser = await this.tryParseAdminToken(token);
    if (adminUser) {
      authentication.endUser = adminUser;
      authentication.superAdmin = true;
    }

    // Try to parse as end user token (Cognito)
    if (!authentication.endUser) {
      const endUser = await this.tryParseEndUserToken(token);
      if (endUser) {
        authentication.endUser = endUser;
        authentication.superAdmin = endUser.superAdmin;
      }
    }

    // Try to parse as merchant user token
    const merchantUser = await this.tryParseMerchantUserToken(token);
    if (merchantUser) {
      authentication.merchantUser = merchantUser;
    }

    // Set authentication if we found either type
    if (authentication.endUser || authentication.merchantUser) {
      req.authentication = authentication;
    }

    next();
  }

  private async tryParseAdminToken(token: string): Promise<EndUserAuthentication | null> {
    try {
      const payload = decodeJwt(token);
      
      const externalId = payload.sub as string;
      const email = payload.email as string;
      const type = (payload as any).type;

      // Check if this is an admin token
      if (externalId === 'admin-user' && type === 'admin' && email) {
        return {
          id: 'admin-user',
          email: email,
          externalId: externalId,
          superAdmin: true
        };
      }
    } catch (error) {
      // Not a valid admin token, that's fine
    }
    
    return null;
  }

  private async tryParseEndUserToken(token: string): Promise<EndUserAuthentication | null> {
    try {
      const jwtSecret = this.configService.get<string>('jwt.secret');
      if (!jwtSecret) {
        return null;
      }

      const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret));

      const userId = payload.userId as string;
      const email = payload.email as string;
      const externalId = payload.sub as string;

      if (!userId || !email || !externalId) {
        return null;
      }

      const user = await this.userRepository.findUserById(userId);

      if (user) {
        return {
          id: user.id,
          email: user.email!,
          externalId: user.external_id!,
          superAdmin: user.super_admin || false
        };
      }
    } catch (error) {
      // Not a valid end user token, that's fine
    }

    return null;
  }

  private async tryParseMerchantUserToken(token: string): Promise<MerchantUserAuthentication | null> {
    try {
      const payload = decodeJwt(token);
      
      // Check if this looks like a merchant token (has merchantId and userId)
      const merchantPayload = payload as any;
      if (!merchantPayload.userId || !merchantPayload.merchantId || !merchantPayload.role) {
        return null;
      }

      const merchantUser = await this.merchantUserRepository.findUserById(merchantPayload.userId);
      
      if (merchantUser && merchantUser.is_active) {
        return {
          id: merchantUser.id,
          merchantId: merchantUser.merchant_id,
          login: merchantUser.login,
          role: merchantPayload.role,
          isActive: merchantUser.is_active
        };
      }
    } catch (error) {
      // Not a valid merchant token, that's fine
    }
    
    return null;
  }
} 