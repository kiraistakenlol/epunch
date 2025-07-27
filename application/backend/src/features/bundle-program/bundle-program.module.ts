import { Module, forwardRef } from '@nestjs/common';
import { BundleProgramController } from './bundle-program.controller';
import { BundleProgramService } from './bundle-program.service';
import { BundleProgramRepository } from './bundle-program.repository';
import { MerchantModule } from '../merchant/merchant.module';

@Module({
  imports: [forwardRef(() => MerchantModule)],
  controllers: [BundleProgramController],
  providers: [BundleProgramService, BundleProgramRepository],
  exports: [BundleProgramService, BundleProgramRepository],
})
export class BundleProgramModule {} 