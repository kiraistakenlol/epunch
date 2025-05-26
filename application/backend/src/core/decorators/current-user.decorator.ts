import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CurrentUser } from '../types/current-user.interface';

export const User = createParamDecorator(
  (required: boolean = false, ctx: ExecutionContext): CurrentUser | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.currentUser;

    if (required && !user) {
      throw new UnauthorizedException('Authentication required');
    }

    return user;
  },
); 