import { Module } from '@nestjs/common';
import { PunchCardStyleController } from './punch-card-style.controller';
import { PunchCardStyleService } from './punch-card-style.service';
import { PunchCardStyleRepository } from './punch-card-style.repository';

@Module({
  imports: [],
  controllers: [PunchCardStyleController],
  providers: [PunchCardStyleService, PunchCardStyleRepository],
  exports: [PunchCardStyleService, PunchCardStyleRepository],
})
export class PunchCardStyleModule {} 