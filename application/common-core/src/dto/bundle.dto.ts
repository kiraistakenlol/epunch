import { MerchantDto } from './merchant.dto';

export interface BundleProgramPreset {
  quantity: number;
  validityDays: number | null;
}

// For merchants (includes presets)
export interface BundleProgramDto {
  id: string;
  merchantId: string;
  name: string;
  itemName: string;
  description: string | null;
  quantityPresets: BundleProgramPreset[];
  isActive: boolean;
  createdAt: string;
}

// For users (no presets needed)
export interface BundleProgramSummaryDto {
  id: string;
  name: string;
  itemName: string;
  description: string | null;
  merchantName: string;
}

export interface BundleDto {
  id: string;
  userId: string;
  bundleProgram: BundleProgramSummaryDto;
  originalQuantity: number;
  remainingQuantity: number;
  expiresAt: string | null;
  createdAt: string;
  lastUsedAt: string | null;
}

// Create/Update DTOs
export interface BundleProgramCreateDto {
  name: string;
  itemName: string;
  description?: string;
  quantityPresets: BundleProgramPreset[];
  isActive?: boolean;
}

export interface BundleProgramUpdateDto {
  name?: string;
  itemName?: string;
  description?: string;
  quantityPresets?: BundleProgramPreset[];
  isActive?: boolean;
}

export interface BundleCreateDto {
  userId: string;
  bundleProgramId: string;
  quantity: number;
  validityDays?: number;
}

export interface BundleUseDto {
  quantityUsed?: number;
} 