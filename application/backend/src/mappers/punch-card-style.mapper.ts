import { PunchCardStyleDto } from 'e-punch-common-core';
import { PunchCardStyle } from '../features/punch-card-style/punch-card-style.repository';

export class PunchCardStyleMapper {
  static toDto(style: PunchCardStyle): PunchCardStyleDto {
    return {
      primaryColor: style.primary_color,
      secondaryColor: style.secondary_color,
      logoUrl: style.logo_url,
      backgroundImageUrl: style.background_image_url,
      punchIcons: style.punch_icons,
    };
  }

  static toDtoArray(styles: PunchCardStyle[]): PunchCardStyleDto[] {
    return styles.map(style => this.toDto(style));
  }
} 