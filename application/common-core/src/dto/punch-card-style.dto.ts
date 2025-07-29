export interface PunchCardStyleDto {
  primaryColor: string | null;
  secondaryColor: string | null;
  logoUrl: string | null;
  punchIcons: PunchIconsDto | null;
}

export interface PunchIconSVG {
  svg_raw_content: string;
}

export interface PunchIcon {
  type: 'svg';
  data: PunchIconSVG;
}

export interface PunchIconsDto {
  filled: PunchIcon | null;
  unfilled: PunchIcon | null;
}

export interface FileUploadUrlDto {
  fileName: string;
}

export interface FileUploadResponseDto {
  uploadUrl: string;
  publicUrl: string;
} 

export const emptyPunchCardStyle: PunchCardStyleDto = {
  primaryColor: null,
  secondaryColor: null,
  logoUrl: null,
  punchIcons: null
}