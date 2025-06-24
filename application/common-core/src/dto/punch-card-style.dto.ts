export interface PunchCardStyleDto {
  primaryColor: string | null;
  secondaryColor: string | null;
  logoUrl: string | null;
  backgroundImageUrl: string | null; // todo deprecated
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