export interface MerchantDto {
  id: string;
  name: string;
  address: string | null;
  slug: string;
  email: string; // todo remove this once merchantUser concept is implemented
  createdAt: string;
}

export interface CreateMerchantDto {
  name: string;
  address?: string;
  slug: string;
  login: string;
  password: string;
}

export interface UpdateMerchantDto {
  name?: string;
  address?: string;
  slug?: string;
  login?: string;
  password?: string;
}

export interface MerchantLoginDto {
  login: string;
  password: string;
}

export interface MerchantLoginResponse {
  token: string;
  merchant: MerchantDto;
} 