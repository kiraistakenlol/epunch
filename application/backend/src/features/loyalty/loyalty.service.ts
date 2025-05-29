import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoyaltyRepository } from './loyalty.repository';
import { LoyaltyProgramDto } from 'e-punch-common-core';

@Injectable()
export class LoyaltyService {
  private readonly logger = new Logger(LoyaltyService.name);

  constructor(private readonly loyaltyRepository: LoyaltyRepository) {}

  async getLoyaltyPrograms(ids: string[]): Promise<LoyaltyProgramDto[]> {
    this.logger.log(`Fetching loyalty programs: ${ids.join(', ')}`);
    
    try {
      const loyaltyPrograms = await this.loyaltyRepository.findLoyaltyProgramsByIds(ids);
      
      // Get unique merchant IDs
      const merchantIds = [...new Set(loyaltyPrograms.map(lp => lp.merchant_id))];
      const merchants = await this.loyaltyRepository.findMerchantsByIds(merchantIds);
      
      // Create a map for quick merchant lookup
      const merchantMap = new Map(merchants.map(m => [m.id, m]));
      
      const loyaltyProgramDtos: LoyaltyProgramDto[] = [];
      
      for (const loyaltyProgram of loyaltyPrograms) {
        const merchant = merchantMap.get(loyaltyProgram.merchant_id);
        
        if (!merchant) {
          this.logger.warn(`Merchant not found for loyalty program ${loyaltyProgram.id}`);
          continue;
        }

        loyaltyProgramDtos.push({
          id: loyaltyProgram.id,
          name: loyaltyProgram.name,
          description: loyaltyProgram.description,
          requiredPunches: loyaltyProgram.required_punches,
          rewardDescription: loyaltyProgram.reward_description,
          isActive: true,
          merchant: {
            id: merchant.id,
            name: merchant.name,
            address: merchant.address || '',
            email: '',
            createdAt: merchant.created_at.toISOString(),
          },
          createdAt: loyaltyProgram.created_at.toISOString(),
        });
      }

      this.logger.log(`Found ${loyaltyProgramDtos.length} loyalty programs`);
      return loyaltyProgramDtos;
    } catch (error: any) {
      this.logger.error(`Error fetching loyalty programs ${ids.join(', ')}: ${error.message}`, error.stack);
      throw error;
    }
  }

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