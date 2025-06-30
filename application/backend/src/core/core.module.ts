import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './middleware/auth.middleware';
import { SecurityCheckGuard } from './guards/security-check.guard';
import { UserModule } from '../features/user/user.module';
import { MerchantModule } from '../features/merchant/merchant.module';

@Module({
  imports: [UserModule, MerchantModule],
  providers: [AuthMiddleware, SecurityCheckGuard],
  exports: [SecurityCheckGuard],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
} 