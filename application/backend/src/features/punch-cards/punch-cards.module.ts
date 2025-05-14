import { Module } from '@nestjs/common';
import { PunchCardsController } from './punch-cards.controller';
import { PunchCardsService } from './punch-cards.service';
import { PunchCardsRepository } from './punch-cards.repository';
import { SupabaseModule } from '../../supabase/supabase.module';

@Module({
  imports: [
    SupabaseModule
  ],
  controllers: [PunchCardsController],
  providers: [PunchCardsService, PunchCardsRepository],
  exports: [PunchCardsService, PunchCardsRepository]
})
export class PunchCardsModule {} 