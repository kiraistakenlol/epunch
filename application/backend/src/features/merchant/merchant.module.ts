import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { MerchantRepository } from './merchant.repository';
import { LoyaltyRepository } from '../loyalty/loyalty.repository';
import { UserRepository } from '../user/user.repository';
import { PunchCardsRepository } from '../punch-cards/punch-cards.repository';
import { MerchantUserRepository } from '../merchant-user/merchant-user.repository';
import { FileUploadService } from './file-upload.service';
import { DatabaseModule } from '../../database/database.module';
import { AppConfigModule } from '../../config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { BundleProgramService } from '../bundle-program/bundle-program.service';
import { BundleProgramRepository } from '../bundle-program/bundle-program.repository';
import { BundleModule } from '../bundle/bundle.module';

@Module({
  imports: [
    DatabaseModule,
    AppConfigModule,
    BundleModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [MerchantController],
  providers: [
    MerchantService,
    MerchantRepository,
    LoyaltyRepository,
    UserRepository,
    PunchCardsRepository,
    MerchantUserRepository,
    FileUploadService,
    BundleProgramService,
    BundleProgramRepository,
  ],
  exports: [MerchantService, MerchantRepository, MerchantUserRepository],
})
export class MerchantModule {} 