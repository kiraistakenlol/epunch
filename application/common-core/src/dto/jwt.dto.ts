import { Role } from '../constants/roles';

export interface JwtPayloadDto {
  userId: string;
  merchantId: string;
  role: Role;
} 