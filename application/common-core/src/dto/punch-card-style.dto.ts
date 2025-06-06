export interface PunchCardStyleDto {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  backgroundImageUrl?: string | null;
}

export interface CreatePunchCardStyleDto {
  loyaltyProgramId?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
}

export interface UpdatePunchCardStyleDto {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
}

export interface FileUploadUrlDto {
  fileName: string;
}

export interface FileUploadResponseDto {
  uploadUrl: string;
  publicUrl: string;
} 