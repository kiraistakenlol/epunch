import { Module, forwardRef } from '@nestjs/common';
import { BenefitCardController } from './benefit-card.controller';
import { BenefitCardService } from './benefit-card.service';
import { BenefitCardRepository } from './benefit-card.repository';
import { DatabaseModule } from '../../database/database.module';
import { WebSocketModule } from '../../websocket/websocket.module';
import { UserModule } from '../user/user.module';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [DatabaseModule, WebSocketModule, forwardRef(() => UserModule), forwardRef(() => CoreModule)],
  controllers: [BenefitCardController],
  providers: [BenefitCardService, BenefitCardRepository],
  exports: [BenefitCardService, BenefitCardRepository],
})
export class BenefitCardModule {}