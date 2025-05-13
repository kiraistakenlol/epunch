import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Database } from '../features/punch-cards/types/database.types';

export const getSupabaseClient = (configService: ConfigService) => {
  const supabaseUrl = configService.get<string>('supabase.url');
  const supabaseKey = configService.get<string>('supabase.apiKey');
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey);
}; 