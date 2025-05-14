import { Injectable, Inject } from '@nestjs/common';
import { PunchCardDto, PunchCardStatusDto } from 'e-punch-common';
import { SupabaseClient } from '@supabase/supabase-js';
import { 
  Database, 
  LoyaltyProgram, 
  Merchant, 
  PunchCard, 
  Punch,
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

  async findLoyaltyProgramById(loyaltyProgramId: string): Promise<LoyaltyProgram | null> {
    const { data, error } = await this.query(Tables.loyalty_program)
      .select('*')
      .eq('id', loyaltyProgramId)
      .maybeSingle(); // Returns a single record or null, not an array

    if (error) {
      // Log error appropriately
      console.error(`Error fetching loyalty program ${loyaltyProgramId}:`, error);
      throw error;
    }
    return data;
  }

  async findPunchCardByUserIdAndLoyaltyProgramId(
    userId: string, 
    loyaltyProgramId: string,
    requiredPunchesForProgram: number
  ): Promise<PunchCard | null> {
    const { data, error } = await this.query(Tables.punch_card)
      .select('*')
      .eq('user_id', userId)
      .eq('loyalty_program_id', loyaltyProgramId)
      .lt('current_punches', requiredPunchesForProgram)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching latest active punch card for user ${userId}, program ${loyaltyProgramId} with ${requiredPunchesForProgram} required punches:`, error);
      throw error;
    }
    return data;
  }

  async createPunchCard(userId: string, loyaltyProgramId: string, initialPunches: number = 0): Promise<PunchCard> {
    const { data, error } = await this.query(Tables.punch_card)
      .insert({
        user_id: userId,
        loyalty_program_id: loyaltyProgramId,
        current_punches: initialPunches,
      })
      .select()
      .single(); // Assuming insert returns the created record

    if (error || !data) {
      console.error(`Error creating punch card for user ${userId}, program ${loyaltyProgramId}:`, error);
      throw error || new Error('Failed to create punch card or no data returned.');
    }
    return data;
  }

  async updatePunchCardPunches(punchCardId: string, newPunchCount: number): Promise<PunchCard> {
    const { data, error } = await this.query(Tables.punch_card)
      .update({ current_punches: newPunchCount })
      .eq('id', punchCardId)
      .select()
      .single();

    if (error || !data) {
      console.error(`Error updating punch card ${punchCardId}:`, error);
      throw error || new Error('Failed to update punch card or no data returned.');
    }
    return data;
  }

  async createPunchRecord(punchCardId: string): Promise<Punch> {
    const { data, error } = await this.query(Tables.punch)
      .insert({ punch_card_id: punchCardId })
      .select()
      .single();

    if (error || !data) {
      console.error(`Error creating punch record for punch_card_id ${punchCardId}:`, error);
      throw error || new Error('Failed to create punch record or no data returned.');
    }
    return data;
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
      
      let status: PunchCardStatusDto;
      if (card.current_punches >= loyaltyProgram.required_punches) {
        status = 'REWARD_READY';
      } else {
        status = 'ACTIVE';
      }
      // NOTE: 'REWARD_REDEEMED' status is not handled here as its determination logic is not available.
      
      return {
        shopName: merchant.name,
        shopAddress: merchant.address || '', // Convert null to empty string
        currentPunches: card.current_punches,
        totalPunches: loyaltyProgram.required_punches,
        status: status,
      };
    });
  }
} 