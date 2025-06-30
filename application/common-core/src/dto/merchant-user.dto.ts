import { Role } from '../constants/roles';

export interface MerchantUserDto {
  id: string;
  merchantId: string;
  login: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMerchantUserDto {
  login: string;
  password: string;
  role: Role;
}

export interface UpdateMerchantUserDto {
  login?: string;
  password?: string;
  role?: Role;
  isActive?: boolean;
}

export interface MerchantUserLoginDto {
  merchantSlug: string;
  login: string;
  password: string;
}

export interface MerchantUserLoginResponse {
  token: string;
  user: MerchantUserDto;
} 