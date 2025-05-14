import { Module } from '@nestjs/common';
import { PunchesController } from './punches.controller';
import { PunchesService } from './punches.service';
import { PunchCardsModule } from '../punch-cards/punch-cards.module';
import { SupabaseModule } from '../../supabase/supabase.module';

@Module({
  imports: [
    PunchCardsModule, // Provides PunchCardsService and PunchCardsRepository
    SupabaseModule,   // If PunchesService/Repository directly writes to 'punch' table
  ],
  controllers: [PunchesController],
  providers: [PunchesService],
})
export class PunchesModule {} 