import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoyaltyProgramDto, MerchantLoginResponse } from 'e-punch-common-core';
import { MerchantRepository } from './merchant.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MerchantService {
  private readonly logger = new Logger(MerchantService.name);

  constructor(
    private readonly merchantRepository: MerchantRepository,
    private readonly jwtService: JwtService
  ) {}

  async validateMerchant(login: string, password: string): Promise<MerchantLoginResponse | null> {
    this.logger.log(`Validating merchant with login: ${login}`);
    
    try {
      const merchant = await this.merchantRepository.findMerchantByLogin(login);
      
      if (!merchant || !merchant.password_hash || !merchant.login) {
        this.logger.warn(`Merchant not found or missing auth fields with login: ${login}`);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, merchant.password_hash);
      
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for merchant: ${login}`);
        return null;
      }

      const payload = { sub: merchant.id, login: merchant.login };
      const token = this.jwtService.sign(payload);

      this.logger.log(`Merchant authenticated successfully: ${login}`);
      
      return {
        token,
        merchant: {
          id: merchant.id,
          name: merchant.name,
          address: merchant.address,
          email: merchant.login,
          createdAt: merchant.created_at.toISOString(),
        },
      };
    } catch (error: any) {
      this.logger.error(`Error validating merchant ${login}: ${error.message}`, error.stack);
      throw error;
    }
  }

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