import { Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';
import { Database, LoyaltyProgram, Merchant, Tables } from '../punch-cards/types/database.types'; // Adjust path if database.types.ts is moved/centralized

@Injectable()
export class LoyaltyRepository {
  private readonly logger = new Logger(LoyaltyRepository.name);

  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient<Database>) {}

  async findLoyaltyProgramById(id: string): Promise<LoyaltyProgram | null> {
    this.logger.log(`Attempting to find loyalty program with id: ${id}`);
    const { data, error } = await this.supabase
      .from(Tables.loyalty_program)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      this.logger.error(`Error fetching loyalty program with id ${id}:`, error.message);
      return null;
    }
    if (!data) {
      this.logger.warn(`No loyalty program found with id: ${id}`);
      return null;
    }
    this.logger.log(`Successfully found loyalty program with id: ${id}`);
    return data;
  }

  async findMerchantById(id: string): Promise<Merchant | null> {
    this.logger.log(`Attempting to find merchant with id: ${id}`);
    const { data, error } = await this.supabase
      .from(Tables.merchant)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      this.logger.error(`Error fetching merchant with id ${id}:`, error.message);
      return null;
    }
    if (!data) {
      this.logger.warn(`No merchant found with id: ${id}`);
      return null;
    }
    this.logger.log(`Successfully found merchant with id: ${id}`);
    return data;
  }
} 