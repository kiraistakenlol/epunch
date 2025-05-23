import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { configSchema } from './config.schema';

const logger = new Logger('ConfigModule');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      load: [configuration],
      validate: (envConfig) => {
        const { error } = configSchema.validate(envConfig, {
          allowUnknown: true,
          abortEarly: false,
        });

        if (error) {
          logger.error('Configuration validation failed:');
          throw new Error(`Config validation error: ${error.message}`);
        }

        const schema = configSchema.describe();
        const secrets = new Set(
          Object.entries(schema.keys)
            .filter(([_, desc]: [string, any]) => desc.meta?.some((m: any) => m.secret))
            .map(([key]) => key)
        );

        logger.log('Configuration validated successfully:');
        Object.entries(envConfig).forEach(([key, val]) => {
          if (schema.keys[key] && !secrets.has(key) && val !== undefined) {
            logger.log(`- ${key}: ${val}`);
          }
        });

        return envConfig;
      },
    }),
  ],
})
export class AppConfigModule {} 