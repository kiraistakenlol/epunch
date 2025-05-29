import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decodeJwt } from 'jose';
import { UserRepository } from '../../features/user/user.repository';
import { CurrentUser } from '../types/current-user.interface';

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUser;
    }
  }
}

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtAuthMiddleware.name);

  constructor(private userRepository: UserRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    try {
      const token = authHeader.substring(7);
      const payload = decodeJwt(token);
      
      const externalId = payload.sub as string;
      const email = payload.email as string;

      if (!externalId || !email) {
        this.logger.warn('Invalid JWT payload: missing sub or email');
        return next();
      }

      const user = await this.userRepository.findUserByExternalId(externalId);
      
      if (user) {
        req.currentUser = {
          id: user.id,
          email: user.email!,
          externalId: user.external_id!,
          superAdmin: user.super_admin || false
        } as CurrentUser;
      }
    } catch (error) {
      this.logger.warn('Failed to decode JWT token:', error);
    }

    next();
  }
} 