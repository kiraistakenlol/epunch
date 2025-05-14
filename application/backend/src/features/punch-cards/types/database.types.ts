import { SupabaseClient } from '@supabase/supabase-js';

// Define the Database schema
export type Database = {
  public: {
    Tables: {
      user: {
        Row: User;
        Insert: Omit<User, 'created_at'>;
        Update: Partial<Omit<User, 'created_at'>>;
      };
      merchant: {
        Row: Merchant;
        Insert: Omit<Merchant, 'created_at'>;
        Update: Partial<Omit<Merchant, 'created_at'>>;
      };
      loyalty_program: {
        Row: LoyaltyProgram;
        Insert: Omit<LoyaltyProgram, 'created_at'>;
        Update: Partial<Omit<LoyaltyProgram, 'created_at'>>;
      };
      punch_card: {
        Row: PunchCard;
        Insert: Omit<PunchCard, 'created_at'>;
        Update: Partial<Omit<PunchCard, 'created_at'>>;
      };
      punch: {
        Row: Punch;
        Insert: Omit<Punch, 'created_at'>;
        Update: Partial<Omit<Punch, 'created_at'>>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {};
  };
};

// Type-safe table names
export const Tables = {
  user: 'user',
  merchant: 'merchant',
  loyalty_program: 'loyalty_program',
  punch_card: 'punch_card',
  punch: 'punch'
} as const;

// Type representing valid table names
export type TableName = keyof Database['public']['Tables'];

// Type-safe query helper
export function createQueryBuilder<T extends TableName>(
  supabase: SupabaseClient<Database>,
  table: T
) {
  return supabase.from(table);
}

// Entity types
export type User = {
  id: string;
  created_at: string;
};

export type Merchant = {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
};

export type LoyaltyProgram = {
  id: string;
  merchant_id: string;
  name: string;
  description: string | null;
  required_punches: number;
  reward_description: string;
  created_at: string;
};

export type PunchCardStatus = 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED'; // Define the status type

export type PunchCard = {
  id: string;
  user_id: string;
  loyalty_program_id: string;
  current_punches: number;
  status: PunchCardStatus; // Added status field
  created_at: string;
};

export type Punch = {
  id: string;
  punch_card_id: string;
  created_at: string;
}; 