import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { MerchantRepository } from './merchant.repository';

@Injectable()
export class MerchantService {
  private readonly logger = new Logger(MerchantService.name);

  constructor(private readonly merchantRepository: MerchantRepository) {}

  async getMerchantLoyaltyPrograms(merchantId: string): Promise<LoyaltyProgramDto[]> {
    this.logger.log(`Fetching loyalty programs for merchant: ${merchantId}`);
    
    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);
      
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const loyaltyPrograms = await this.merchantRepository.findLoyaltyProgramsByMerchantId(merchantId);
      this.logger.log(`Found ${loyaltyPrograms.length} loyalty programs for merchant: ${merchantId}`);
      return loyaltyPrograms;
    } catch (error: any) {
      this.logger.error(`Error fetching loyalty programs for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 