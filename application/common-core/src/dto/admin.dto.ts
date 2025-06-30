export interface AdminLoginDto {
  login: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
} 