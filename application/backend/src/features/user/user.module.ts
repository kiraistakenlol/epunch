import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { PunchCardsModule } from '../punch-cards/punch-cards.module';

@Module({
  imports: [PunchCardsModule],
  controllers: [UserController],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {} 