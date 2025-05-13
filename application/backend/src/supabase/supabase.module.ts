import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getSupabaseClient } from './client';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return getSupabaseClient(configService);
      },
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {} 