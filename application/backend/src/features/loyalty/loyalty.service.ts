import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoyaltyRepository } from './loyalty.repository';
import { LoyaltyProgramDto } from 'e-punch-common-core';

@Injectable()
export class LoyaltyService {
  private readonly logger = new Logger(LoyaltyService.name);

  constructor(private readonly loyaltyRepository: LoyaltyRepository) {}

  async getLoyaltyProgram(id: string): Promise<LoyaltyProgramDto> {
    this.logger.log(`Fetching loyalty program: ${id}`);
    
    try {
      const loyaltyProgram = await this.loyaltyRepository.findLoyaltyProgramById(id);
      
      if (!loyaltyProgram) {
        throw new NotFoundException(`Loyalty program with ID ${id} not found`);
      }

      const merchant = await this.loyaltyRepository.findMerchantById(loyaltyProgram.merchant_id);
      
      if (!merchant) {
        throw new NotFoundException(`Merchant not found for loyalty program ${id}`);
      }

      const loyaltyProgramDto: LoyaltyProgramDto = {
        id: loyaltyProgram.id,
        name: loyaltyProgram.name,
        description: loyaltyProgram.description,
        requiredPunches: loyaltyProgram.required_punches,
        rewardDescription: loyaltyProgram.reward_description,
        isActive: true, // Default to true since the repository doesn't have this field
        merchant: {
          id: merchant.id,
          name: merchant.name,
          address: merchant.address || '',
          email: '', // Not available in current schema
          createdAt: merchant.created_at.toISOString(),
        },
        createdAt: loyaltyProgram.created_at.toISOString(),
      };

      this.logger.log(`Found loyalty program: ${id}`);
      return loyaltyProgramDto;
    } catch (error: any) {
      this.logger.error(`Error fetching loyalty program ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 