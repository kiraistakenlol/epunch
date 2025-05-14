import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface DevResponse {
  status: string;
  message: string;
  [key: string]: any;
}

@Injectable()
export class DevService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseKey = this.configService.get<string>('supabase.apiKey');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getStatus(): Promise<DevResponse> {
    try {
      // Test Supabase connection with a simple query instead of using aggregate functions
      const { data, error } = await this.supabase.from('user').select('id').limit(5);
      
      if (error) {
        return {
          status: 'error',
          message: 'Supabase connection error',
          details: error.message,
        };
      }

      return {
        status: 'success',
        message: 'Development API is active',
        dbConnection: 'ok',
        userSample: data.map(user => user.id),
        userCount: data.length,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Failed to check system status',
        error: error.message,
      };
    }
  }

  async generateTestData(): Promise<DevResponse> {
    try {
      // Execute test data SQL script
      const { error } = await this.supabase.rpc('execute_test_data_script');
      
      if (error) {
        console.error('Error generating test data:', error);
        return {
          status: 'error',
          message: 'Failed to generate test data',
          details: error.message,
        };
      }

      return {
        status: 'success',
        message: 'Test data generated successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Failed to generate test data',
        error: error.message,
      };
    }
  }

  async resetTestData(): Promise<DevResponse> {
    try {
      // Execute a cleanup script
      const { error } = await this.supabase.rpc('reset_test_data');
      
      if (error) {
        return {
          status: 'error',
          message: 'Failed to reset test data',
          details: error.message,
        };
      }

      return {
        status: 'success',
        message: 'Test data reset successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const error = err as Error;
      return {
        status: 'error',
        message: 'Failed to reset test data',
        error: error.message,
      };
    }
  }
} 