import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ApiResponseInterceptor } from './core/interceptors/api-response.interceptor';
// import { GlobalHttpExceptionFilter } from './core/filters/global-http-exception.filter'; // Commented out as not yet implemented

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  // app.useGlobalFilters(new GlobalHttpExceptionFilter()); // Commented out as not yet implemented

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  const host = configService.getOrThrow<string>('app.host');
  const port = configService.getOrThrow<number>('app.port');
  await app.listen(port, host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap(); 