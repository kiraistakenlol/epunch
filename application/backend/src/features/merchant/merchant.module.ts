import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { MerchantRepository } from './merchant.repository';
import { MerchantUserRepository } from '../merchant-user/merchant-user.repository';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret-key',
    }),
  ],
  controllers: [MerchantController],
  providers: [MerchantService, MerchantRepository, MerchantUserRepository, FileUploadService],
  exports: [MerchantService, MerchantRepository, MerchantUserRepository, FileUploadService]
})
export class MerchantModule {} 