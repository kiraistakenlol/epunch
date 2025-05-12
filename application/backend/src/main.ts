import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GREETING } from 'e-punch-common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5001);
  console.log(`Backend received: ${GREETING}`);
}
bootstrap(); 