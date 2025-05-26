import { Injectable } from '@nestjs/common';
import { decodeJwt } from 'jose';
import { UserRepository } from '../user/user.repository';
import { AuthRequestDto, AuthResponseDto, UserDto } from 'e-punch-common-core';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async authenticateUser(authRequest: AuthRequestDto): Promise<AuthResponseDto> {
    const { authToken, userId } = authRequest;

    const payload = decodeJwt(authToken);
    const externalId = payload.sub as string;
    const email = payload.email as string;

    let user = await this.userRepository.findUserByExternalId(externalId);

    if (!user) {
      user = await this.userRepository.createUser(userId, externalId, email);
    }

    return {
      user: {
        id: user.id,
        email: user.email!
      } as UserDto,
    };
  }
} 