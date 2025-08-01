import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Authentication } from '../types/authentication.interface';
import { ROLES } from 'e-punch-common-core';

@Injectable()
export class AuthorizationService {
  
  private ensureAuthenticated(auth: Authentication): void {
    if (auth === undefined) {
      throw new UnauthorizedException('Authentication required');
    }
  }

  private isSuperAdmin(auth: Authentication): boolean {
    this.ensureAuthenticated(auth);
    return auth.superAdmin;
  }

  private ensureMerchantUser(auth: Authentication): void {
    this.ensureAuthenticated(auth);
    if (!auth.merchantUser) {
      throw new ForbiddenException('Merchant user required');
    }
  }

  private ensureMerchantOwnership(auth: Authentication, merchantId: string): void {
    this.ensureMerchantUser(auth);
    if (merchantId !== auth.merchantUser!.merchantId) {
      throw new ForbiddenException('The resource does not belong to the merchant');
    }
  }

  validateMerchantAdmin(auth: Authentication): void {
    this.ensureAuthenticated(auth);
    if (this.isSuperAdmin(auth)) return;
    this.ensureMerchantUser(auth);
    if (auth.merchantUser!.role !== ROLES.ADMIN) {
      throw new ForbiddenException('Admin role required');
    }
  }

  validateBundleReadAccess(auth: Authentication, bundle: { user_id: string, merchant_id: string }): void {
    this.ensureAuthenticated(auth);
    if (this.isSuperAdmin(auth)) return;
    if (auth.endUser && bundle.user_id === auth.endUser.id) return;
    this.ensureMerchantOwnership(auth, bundle.merchant_id);
  }

  validateBundleCreateAccess(auth: Authentication, bundleProgram: { merchant_id: string }): void {
    this.ensureAuthenticated(auth);
    if (this.isSuperAdmin(auth)) return;
    this.ensureMerchantOwnership(auth, bundleProgram.merchant_id);
  }

  validateBundleUpdateAccess(auth: Authentication, bundle: { merchant_id: string }): void {
    this.ensureAuthenticated(auth);
    if (this.isSuperAdmin(auth)) return;
    this.ensureMerchantOwnership(auth, bundle.merchant_id);
  }

  validateGetUserBundlesAccess(auth: Authentication, userId: string): void {
    this.ensureAuthenticated(auth);
    if (this.isSuperAdmin(auth)) return;
    if (auth.endUser && userId !== auth.endUser.id) {
      throw new ForbiddenException('Can only access your own bundles');
    }
    if (!auth.endUser && !auth.merchantUser) {
      throw new UnauthorizedException('Authentication required');
    }
  }
}