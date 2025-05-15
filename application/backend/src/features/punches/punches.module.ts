import { Module } from '@nestjs/common';
import { PunchesController } from './punches.controller';
import { PunchesService } from './punches.service';
import { PunchCardsModule } from '../punch-cards/punch-cards.module';
import { SupabaseModule } from '../../supabase/supabase.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';

@Module({
  imports: [
    PunchCardsModule, // Provides PunchCardsService and PunchCardsRepository
    SupabaseModule,   // If PunchesService/Repository directly writes to 'punch' table
    LoyaltyModule,    // Add LoyaltyModule here
  ],
  controllers: [PunchesController],
  providers: [PunchesService], // PunchesService is the primary provider of this module
})
export class PunchesModule {} 