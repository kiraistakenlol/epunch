import { Module, forwardRef } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { PunchCardsModule } from '../punch-cards/punch-cards.module';
import { BundleModule } from '../bundle/bundle.module';

@Module({
  imports: [PunchCardsModule, forwardRef(() => BundleModule)],
  controllers: [UserController],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {} 