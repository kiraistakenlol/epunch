import { Module, forwardRef } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { PunchCardsModule } from '../punch-cards/punch-cards.module';
import { BundleModule } from '../bundle/bundle.module';
import { BenefitCardModule } from '../benefit-card/benefit-card.module';

@Module({
  imports: [PunchCardsModule, forwardRef(() => BundleModule), forwardRef(() => BenefitCardModule)],
  controllers: [UserController],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {} 