import { Injectable, Logger } from '@nestjs/common';
import { decodeJwt } from 'jose';
import { UserRepository } from '../user/user.repository';
import { PunchCardsRepository } from '../punch-cards/punch-cards.repository';
import { AuthRequestDto, AuthResponseDto, UserDto } from 'e-punch-common-core';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userRepository: UserRepository,
    private punchCardsRepository: PunchCardsRepository
  ) { }

  async authenticateUser(authRequest: AuthRequestDto): Promise<AuthResponseDto> {
    const { authToken, userId } = authRequest;

    const payload = decodeJwt(authToken);
    const externalId = payload.sub as string;
    const email = payload.email as string;

    let user = await this.userRepository.findUserByExternalId(externalId);

    if (!user) {
      user = await this.userRepository.createUser(uuidv4(), externalId, email);
    }

    const transferredCards = await this.punchCardsRepository.transferCards(userId, user.id);
    if (transferredCards > 0) {
      this.logger.log(`Transferred ${transferredCards} anonymous cards to authenticated user ${user.id}`);
    }

    return {
      user: {
        id: user.id,
        email: user.email!,
        superAdmin: user.super_admin || false
      } as UserDto,
    };
  }
} 