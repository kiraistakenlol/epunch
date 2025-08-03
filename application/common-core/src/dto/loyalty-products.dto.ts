import { PunchCardDto } from './punch-card.dto';
import { BundleDto } from './bundle.dto';

export interface LoyaltyProductsDto {
  punchCards: PunchCardDto[];
  bundles: BundleDto[];
}