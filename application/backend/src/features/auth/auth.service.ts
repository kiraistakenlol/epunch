import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignJWT } from 'jose';
import { UserRepository } from '../user/user.repository';
import { PunchCardsRepository } from '../punch-cards/punch-cards.repository';
import { AuthRequestDto, AuthResponseDto, UserDto, GoogleTokenResponse, GoogleUserInfo } from 'e-punch-common-core';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleTokenUrl = 'https://oauth2.googleapis.com/token';
  private readonly googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

  constructor(
    private userRepository: UserRepository,
    private punchCardsRepository: PunchCardsRepository,
    private configService: ConfigService
  ) { }

  async authenticateUser(authRequest: AuthRequestDto): Promise<AuthResponseDto> {
    const { googleCode, userId } = authRequest;

    try {
      const tokenResponse = await axios.post<GoogleTokenResponse>(this.googleTokenUrl, {
        code: googleCode,
        client_id: this.configService.getOrThrow<string>('google.clientId'),
        client_secret: this.configService.getOrThrow<string>('google.clientSecret'),
        redirect_uri: this.configService.getOrThrow<string>('google.redirectUri'),
        grant_type: 'authorization_code',
      });

      const userInfoResponse = await axios.get<GoogleUserInfo>(this.googleUserInfoUrl, {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
      });

      const { sub: externalId, email } = userInfoResponse.data;

      let user = await this.userRepository.findUserByExternalId(externalId);

      if (!user) {
        user = await this.userRepository.createUser(uuidv4(), externalId, email);
      }

      const transferredCards = await this.punchCardsRepository.transferCards(userId, user.id);
      if (transferredCards > 0) {
        this.logger.log(`Transferred ${transferredCards} anonymous cards to authenticated user ${user.id}`);
      }

      const jwtSecret = this.configService.getOrThrow<string>('jwt.secret');
      const jwtExpiresIn = this.configService.get<string>('jwt.expiresIn', '7d');

      const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        sub: user.external_id
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(jwtExpiresIn)
        .sign(new TextEncoder().encode(jwtSecret));

      return {
        token,
        user: {
          id: user.id,
          email: user.email!,
          superAdmin: user.super_admin || false
        } as UserDto,
      };
    } catch (error: any) {
      this.logger.error(`Google OAuth authentication failed: ${error.message}`, error.stack);
      throw new UnauthorizedException('Invalid Google authorization code');
    }
  }
} 