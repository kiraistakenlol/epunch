import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtAuthMiddleware } from './middleware/jwt-auth.middleware';
import { UserModule } from '../features/user/user.module';

@Module({
  imports: [UserModule],
  providers: [JwtAuthMiddleware],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes('*');
  }
} 