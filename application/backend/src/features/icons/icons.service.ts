import { Injectable } from '@nestjs/common';
import { IconsRepository, IconSearchParams } from './icons.repository';
import { IconSearchResultDto, IconDto } from 'e-punch-common-core';

@Injectable()
export class IconsService {
  constructor(private readonly iconsRepository: IconsRepository) {}

  async searchIcons(
    query?: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<IconSearchResultDto> {
    const offset = (page - 1) * limit;
    
    const params: IconSearchParams = {
      query,
      limit,
      offset,
    };

    const result = await this.iconsRepository.searchIcons(params);
    
    const totalPages = Math.ceil(result.total / limit);
    const hasMore = page < totalPages;

    const simplifiedIcons: IconDto[] = result.icons
      .filter(icon => icon.svg_content)
      .map(icon => ({
        id: icon.name,
        name: icon.display_name,
        svg_content: icon.svg_content!,
      }));

    return {
      icons: simplifiedIcons,
      total: result.total,
      hasMore,
      page,
      totalPages,
    };
  }
} 