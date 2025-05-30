import { Injectable, Logger, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { LoyaltyProgramDto, MerchantLoginResponse, CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto, MerchantDto } from 'e-punch-common-core';
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

  async getAllMerchants(): Promise<MerchantDto[]> {
    this.logger.log('Fetching all merchants');
    
    try {
      const merchants = await this.merchantRepository.findAllMerchants();
      this.logger.log(`Found ${merchants.length} merchants`);
      return merchants;
    } catch (error: any) {
      this.logger.error(`Error fetching all merchants: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMerchantById(merchantId: string): Promise<MerchantDto> {
    this.logger.log(`Fetching merchant by ID: ${merchantId}`);
    
    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);
      
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const merchantDto: MerchantDto = {
        id: merchant.id,
        name: merchant.name,
        address: merchant.address || '',
        slug: merchant.slug,
        email: merchant.login || '',
        createdAt: merchant.created_at.toISOString(),
      };

      this.logger.log(`Found merchant: ${merchantId}`);
      return merchantDto;
    } catch (error: any) {
      this.logger.error(`Error fetching merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMerchantBySlug(slug: string): Promise<MerchantDto> {
    this.logger.log(`Fetching merchant by slug: ${slug}`);
    
    try {
      const merchant = await this.merchantRepository.findMerchantBySlug(slug);
      
      if (!merchant) {
        throw new NotFoundException(`Merchant with slug ${slug} not found`);
      }

      const merchantDto: MerchantDto = {
        id: merchant.id,
        name: merchant.name,
        address: merchant.address || '',
        slug: merchant.slug,
        email: merchant.login || '',
        createdAt: merchant.created_at.toISOString(),
      };

      this.logger.log(`Found merchant: ${slug}`);
      return merchantDto;
    } catch (error: any) {
      this.logger.error(`Error fetching merchant ${slug}: ${error.message}`, error.stack);
      throw error;
    }
  }

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
          slug: merchant.slug,
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

  async createLoyaltyProgram(merchantId: string, data: CreateLoyaltyProgramDto): Promise<LoyaltyProgramDto> {
    this.logger.log(`Creating loyalty program for merchant: ${merchantId}`);
    
    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);
      
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      if (data.requiredPunches > 10) {
        throw new HttpException('Required punches cannot exceed 10', HttpStatus.BAD_REQUEST);
      }

      if (data.requiredPunches < 1) {
        throw new HttpException('Required punches must be at least 1', HttpStatus.BAD_REQUEST);
      }

      const loyaltyProgram = await this.merchantRepository.createLoyaltyProgram(merchantId, data);
      this.logger.log(`Created loyalty program ${loyaltyProgram.id} for merchant: ${merchantId}`);
      return loyaltyProgram;
    } catch (error: any) {
      this.logger.error(`Error creating loyalty program for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateLoyaltyProgram(merchantId: string, programId: string, data: UpdateLoyaltyProgramDto): Promise<LoyaltyProgramDto> {
    this.logger.log(`Updating loyalty program ${programId} for merchant: ${merchantId}`);
    
    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);
      
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      if (data.requiredPunches !== undefined) {
        if (data.requiredPunches > 10) {
          throw new HttpException('Required punches cannot exceed 10', HttpStatus.BAD_REQUEST);
        }

        if (data.requiredPunches < 1) {
          throw new HttpException('Required punches must be at least 1', HttpStatus.BAD_REQUEST);
        }
      }

      const loyaltyProgram = await this.merchantRepository.updateLoyaltyProgram(merchantId, programId, data);
      
      if (!loyaltyProgram) {
        throw new NotFoundException(`Loyalty program with ID ${programId} not found for merchant ${merchantId}`);
      }

      this.logger.log(`Updated loyalty program ${programId} for merchant: ${merchantId}`);
      return loyaltyProgram;
    } catch (error: any) {
      this.logger.error(`Error updating loyalty program ${programId} for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteLoyaltyProgram(merchantId: string, programId: string): Promise<void> {
    this.logger.log(`Deleting loyalty program ${programId} for merchant: ${merchantId}`);
    
    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);
      
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const deleted = await this.merchantRepository.deleteLoyaltyProgram(merchantId, programId);
      
      if (!deleted) {
        throw new NotFoundException(`Loyalty program with ID ${programId} not found for merchant ${merchantId} or already deleted`);
      }

      this.logger.log(`Deleted loyalty program ${programId} for merchant: ${merchantId}`);
    } catch (error: any) {
      this.logger.error(`Error deleting loyalty program ${programId} for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 