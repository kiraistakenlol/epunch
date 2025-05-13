import { Injectable, Inject } from '@nestjs/common';
import { PunchCardDto } from 'e-punch-common';
import { SupabaseClient } from '@supabase/supabase-js';
import { 
  Database, 
  LoyaltyProgram, 
  Merchant, 
  PunchCard, 
  Tables,
  TableName,
  createQueryBuilder
} from './types/database.types';

@Injectable()
export class PunchCardsRepository {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private supabase: SupabaseClient<Database>
  ) {}

  /**
   * Type-safe query builder
   */
  private query<T extends TableName>(table: T) {
    return createQueryBuilder(this.supabase, table);
  }

  async findPunchCardsByUserId(userId: string): Promise<PunchCardDto[]> {
    // Get all punch cards for the user
    const { data: punchCards, error: punchCardsError } = await this.query(Tables.punch_card)
      .select('*')
      .eq('user_id', userId);

    if (punchCardsError) {
      throw punchCardsError;
    }

    // Return empty array if no punch cards are found
    if (!punchCards || punchCards.length === 0) {
      return [];
    }

    // Extract loyalty program IDs to fetch in bulk
    const loyaltyProgramIds = punchCards.map((card: PunchCard) => card.loyalty_program_id);

    // Get all related loyalty programs in one query
    const { data: loyaltyPrograms, error: loyaltyProgramsError } = await this.query(Tables.loyalty_program)
      .select('*')
      .in('id', loyaltyProgramIds);

    if (loyaltyProgramsError) {
      throw loyaltyProgramsError;
    }

    // Create a mapping of loyalty program IDs to loyalty programs for quick lookup
    const loyaltyProgramMap = loyaltyPrograms.reduce<Record<string, LoyaltyProgram>>(
      (map: Record<string, LoyaltyProgram>, program: LoyaltyProgram) => {
        map[program.id] = program;
        return map;
      }, 
      {}
    );

    // Extract merchant IDs to fetch in bulk
    const merchantIds = loyaltyPrograms.map((program: LoyaltyProgram) => program.merchant_id);

    // Get all related merchants in one query
    const { data: merchants, error: merchantsError } = await this.query(Tables.merchant)
      .select('*')
      .in('id', merchantIds);

    if (merchantsError) {
      throw merchantsError;
    }

    // Create a mapping of merchant IDs to merchants for quick lookup
    const merchantMap = merchants.reduce<Record<string, Merchant>>(
      (map: Record<string, Merchant>, merchant: Merchant) => {
        map[merchant.id] = merchant;
        return map;
      }, 
      {}
    );

    // Map the data to DTOs
    return punchCards.map((card: PunchCard) => {
      const loyaltyProgram = loyaltyProgramMap[card.loyalty_program_id];
      const merchant = merchantMap[loyaltyProgram.merchant_id];
      
      return {
        shopName: merchant.name,
        shopAddress: merchant.address || '', // Convert null to empty string
        currentPunches: card.current_punches,
        totalPunches: loyaltyProgram.required_punches,
      };
    });
  }
} 