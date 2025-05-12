import { Controller, Get } from '@nestjs/common';
import { GREETING } from 'e-punch-common';

@Controller('api/v1')
export class AppController {
  @Get('hello-world')
  getHello(): string {
    return GREETING;
  }
} 