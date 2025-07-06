
export interface MerchantDto {
  id: string;
  name: string;
  address: string | null;
  slug: string;
  logoUrl: string;
  createdAt: string;
}

export interface CreateMerchantDto {
  name: string;
  address?: string;
  slug: string;
}

export interface UpdateMerchantDto {
  name?: string;
  address?: string;
  slug?: string;
  logoUrl?: string;
}

export interface MerchantLoginDto {
  login: string;
  password: string;
}

export interface MerchantLoginResponse {
  token: string;
} 