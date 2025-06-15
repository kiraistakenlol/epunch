import { Module } from '@nestjs/common';
import { IconsController } from './icons.controller';
import { IconsService } from './icons.service';
import { IconsRepository } from './icons.repository';

@Module({
  controllers: [IconsController],
  providers: [IconsService, IconsRepository],
  exports: [IconsService, IconsRepository],
})
export class IconsModule {} 