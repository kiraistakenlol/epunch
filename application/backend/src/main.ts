import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ApiResponseInterceptor } from './core/interceptors/api-response.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    
    // Set global API prefix
    app.setGlobalPrefix('api/v1');
    
    app.useGlobalInterceptors(new ApiResponseInterceptor());

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    
    const host = configService.getOrThrow<string>('app.host');
    const port = configService.getOrThrow<number>('app.port');
    await app.listen(port, host);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error: any) {
    logger.error('Failed to start application:', error.message);
    process.exit(1);
  }
}

bootstrap(); 