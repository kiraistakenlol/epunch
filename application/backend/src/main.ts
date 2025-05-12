import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GREETING } from 'e-punch-common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  await app.listen(4000, '0.0.0.0');
  console.log(`Backend received: ${GREETING}`);
}
bootstrap(); 