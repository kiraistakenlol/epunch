import { Controller, Get } from '@nestjs/common';
import { GREETING, ApiResponse } from 'e-punch-common';

@Controller('api/v1')
export class AppController {
  @Get('hello-world')
  getHello(): ApiResponse<string> {
    return ApiResponse.success(GREETING);
  }
} 