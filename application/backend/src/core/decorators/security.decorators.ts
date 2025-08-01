import { createParamDecorator, ExecutionContext, applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { Role } from 'e-punch-common-core';
import { Authentication, SecurityCheckType, EndUserCheck, MerchantUserCheck, OrCheck } from '../types/authentication.interface';
import { SecurityCheckGuard } from '../guards/security-check.guard';

// Parameter decorator to get the authentication object
export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Authentication => {
    const request = ctx.switchToHttp().getRequest();
    console.log('Auth', request.authentication);
    return request.authentication;
  },
);

// Helper functions to create security checks
export const EndUser = (): EndUserCheck => ({
  type: 'end-user'
});

export const MerchantUser = (roles?: Role[]): MerchantUserCheck => ({
  type: 'merchant-user',
  roles
});

export const Or = (...checks: SecurityCheckType[]): OrCheck => ({
  type: 'or',
  checks
});

// Main security decorator
export const RequireAuth = (check: SecurityCheckType) => {
  return applyDecorators(
    SetMetadata('securityCheck', check),
    UseGuards(SecurityCheckGuard)
  );
};

// Convenience decorators for common patterns
export const RequireEndUser = () => RequireAuth(EndUser());
export const RequireMerchantUser = (roles?: Role[]) => RequireAuth(MerchantUser(roles));
export const RequireAnyAuth = () => RequireAuth(Or(EndUser(), MerchantUser()));

// Type guard functions for controllers
export function isEndUser(auth: Authentication): auth is Authentication & { endUser: NonNullable<Authentication['endUser']> } {
  return !!auth.endUser;
}

export function isMerchantUser(auth: Authentication): auth is Authentication & { merchantUser: NonNullable<Authentication['merchantUser']> } {
  return !!auth.merchantUser;
}

export function isSuperAdmin(auth: Authentication): boolean {
  return auth.superAdmin;
} 