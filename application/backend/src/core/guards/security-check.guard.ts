import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Authentication, SecurityCheckType, EndUserCheck, MerchantUserCheck, OrCheck } from '../types/authentication.interface';

@Injectable()
export class SecurityCheckGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const securityCheck = this.reflector.getAllAndOverride<SecurityCheckType>('securityCheck', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!securityCheck) {
      return true; // No security check defined, allow access
    }

    const request = context.switchToHttp().getRequest();
    const authentication: Authentication = request.authentication;

    if (!authentication) {
      throw new UnauthorizedException('Authentication required');
    }

    // Super admin always has access
    if (authentication.superAdmin) {
      return true;
    }

    // Evaluate the security check
    const hasAccess = this.evaluateSecurityCheck(securityCheck, authentication);

    if (!hasAccess) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  private evaluateSecurityCheck(check: SecurityCheckType, auth: Authentication): boolean {
    switch (check.type) {
      case 'end-user':
        return this.evaluateEndUserCheck(check, auth);
      
      case 'merchant-user':
        return this.evaluateMerchantUserCheck(check, auth);
      
      case 'or':
        return this.evaluateOrCheck(check, auth);
      
      default:
        return false;
    }
  }

  private evaluateEndUserCheck(check: EndUserCheck, auth: Authentication): boolean {
    return !!auth.endUser;
  }

  private evaluateMerchantUserCheck(check: MerchantUserCheck, auth: Authentication): boolean {
    if (!auth.merchantUser) {
      return false;
    }

    // If no specific roles are required, any merchant user is allowed
    if (!check.roles || check.roles.length === 0) {
      return true;
    }

    // Check if the merchant user has one of the required roles
    return check.roles.includes(auth.merchantUser.role);
  }

  private evaluateOrCheck(check: OrCheck, auth: Authentication): boolean {
    // If any of the checks in the OR clause passes, allow access
    return check.checks.some(subCheck => this.evaluateSecurityCheck(subCheck as SecurityCheckType, auth));
  }
} 