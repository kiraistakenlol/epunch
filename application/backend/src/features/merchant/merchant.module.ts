import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { MerchantRepository } from './merchant.repository';
import { PunchCardStyleModule } from '../punch-card-style/punch-card-style.module';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    PunchCardStyleModule,
  ],
  controllers: [MerchantController],
  providers: [MerchantService, MerchantRepository, FileUploadService],
  exports: [MerchantService, MerchantRepository, FileUploadService]
})
export class MerchantModule {} 