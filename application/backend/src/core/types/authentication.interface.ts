import { Role } from 'e-punch-common-core';

export interface EndUserAuthentication {
  id: string;
  email: string;
  externalId: string;
  superAdmin: boolean;
}

export interface MerchantUserAuthentication {
  id: string;
  merchantId: string;
  login: string;
  role: Role;
  isActive: boolean;
}

export interface Authentication {
  merchantUser?: MerchantUserAuthentication;
  endUser?: EndUserAuthentication;
  superAdmin: boolean;
}

export interface SecurityCheck {
  type: string;
}

export interface EndUserCheck extends SecurityCheck {
  type: 'end-user';
}

export interface MerchantUserCheck extends SecurityCheck {
  type: 'merchant-user';
  roles?: Role[];
}

export interface OrCheck extends SecurityCheck {
  type: 'or';
  checks: SecurityCheck[];
}

export type SecurityCheckType = EndUserCheck | MerchantUserCheck | OrCheck; 