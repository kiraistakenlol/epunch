import { Module, forwardRef } from '@nestjs/common';
import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';
import { BundleRepository } from './bundle.repository';
import { DatabaseModule } from '../../database/database.module';
import { WebSocketModule } from '../../websocket/websocket.module';
import { UserModule } from '../user/user.module';
import { BundleProgramModule } from '../bundle-program/bundle-program.module';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [DatabaseModule, WebSocketModule, forwardRef(() => UserModule), BundleProgramModule, forwardRef(() => CoreModule)],
  controllers: [BundleController],
  providers: [BundleService, BundleRepository],
  exports: [BundleService, BundleRepository],
})
export class BundleModule {} 