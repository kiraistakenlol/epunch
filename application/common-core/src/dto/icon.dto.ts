export interface IconDto {
  id: string;
  name: string;
  svg_content: string;
}

export interface IconSearchResultDto {
  icons: IconDto[];
  total: number;
  hasMore: boolean;
  page: number;
  totalPages: number;
} 