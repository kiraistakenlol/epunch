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
      validate: (config) => {
        const { error, value } = configSchema.validate(config, {
          allowUnknown: true,
          abortEarly: false,
        });

        if (error) {
          throw new Error(`Config validation error: ${error.message}`);
        }

        // Get schema descriptions to check for secrets
        const schema = configSchema.describe();
        const secrets = new Set(
          Object.entries(schema.keys)
            .filter(([_, desc]: [string, any]) => desc.meta?.some((m: any) => m.secret))
            .map(([key]) => key)
        );

        // Log only schema-defined non-secret config values
        logger.log('Loaded configuration:');
        Object.entries(schema.keys).forEach(([key]) => {
          if (!secrets.has(key) && key in config) {
            logger.log(`${key}: ${config[key]}`);
          }
        });

        return value;
      },
    }),
  ],
})
export class AppConfigModule {} 