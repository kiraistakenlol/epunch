import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [DevController],
  providers: [DevService],
})
export class DevModule {} 