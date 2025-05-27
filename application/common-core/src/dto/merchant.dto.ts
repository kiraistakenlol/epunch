export interface MerchantDto {
  id: string;
  name: string;
  address: string | null;
  email: string;
  createdAt: string;
}

export interface MerchantLoginDto {
  login: string;
  password: string;
}

export interface MerchantLoginResponse {
  token: string;
  merchant: MerchantDto;
} 