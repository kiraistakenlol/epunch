import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from 'e-punch-common-core';

@Controller('api/v1')
export class AppController {
  @Get('hello-world')
  getHello(): ApiResponse<string> {
    return new ApiResponse("Hey");
  }
} 