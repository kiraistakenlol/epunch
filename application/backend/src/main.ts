import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ApiResponseInterceptor } from './core/interceptors/api-response.interceptor';
import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    
    // Configure WebSocket adapter
    app.useWebSocketAdapter(new IoAdapter(app));
    
    // Set global API prefix (excluding WebSocket paths)
    app.setGlobalPrefix('api/v1', {
      exclude: ['/socket.io(.*)'],
    });
    
    app.useGlobalInterceptors(new ApiResponseInterceptor());

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: false,
      allowedHeaders: ['Content-Type', 'Authorization'],
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