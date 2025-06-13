import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PunchCardStyleDto, CreatePunchCardStyleDto, UpdatePunchCardStyleDto } from 'e-punch-common-core';
import { PunchCardStyleRepository } from './punch-card-style.repository';
import { PunchCardsRepository } from '../punch-cards/punch-cards.repository';
import { MerchantRepository } from '../merchant/merchant.repository';
import { LoyaltyRepository } from '../loyalty/loyalty.repository';

@Injectable()
export class PunchCardStyleService {
  private readonly logger = new Logger(PunchCardStyleService.name);

  constructor(
    private readonly punchCardStyleRepository: PunchCardStyleRepository,
    private readonly loyaltyRepository: LoyaltyRepository,
  ) {}

  async getPunchCardStyles(punchCardId: string, loyaltyProgramId: string, merchantId: string): Promise<PunchCardStyleDto> {
    this.logger.log(`Getting punch card styles for punch card: ${punchCardId}, loyalty program: ${loyaltyProgramId}, merchant: ${merchantId}`);
    
    try {
      const loyaltyProgramStyle = await this.punchCardStyleRepository.findLoyaltyProgramStyle(
        merchantId, 
        loyaltyProgramId
      );
      
      if (loyaltyProgramStyle) {
        this.logger.log(`Retrieved loyalty program specific style for punch card: ${punchCardId}`);
        return loyaltyProgramStyle;
      }
      
      this.logger.log(`No loyalty program style found, using merchant default for punch card: ${punchCardId}`);
      return this.getMerchantDefaultStyle(merchantId);
    } catch (error: any) {
      this.logger.error(`Error getting punch card styles for ${punchCardId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getDefaultAppStyle(): Promise<PunchCardStyleDto> {
    this.logger.log('Getting default app-wide punch card style');
    
    return {
      primaryColor: '#3e2723',
      secondaryColor: '#5d4037',
      logoUrl: null,
      backgroundImageUrl: null,
    };
  }

  async getMerchantDefaultStyle(merchantId: string): Promise<PunchCardStyleDto> {
    this.logger.log(`Getting default punch card style for merchant: ${merchantId}`);
    
    try {
      const style = await this.punchCardStyleRepository.findMerchantDefaultStyle(merchantId);
      
      if (style) {
        this.logger.log(`Retrieved default punch card style for merchant: ${merchantId}`);
        return style;
      }
      
      this.logger.log(`No merchant style found for ${merchantId}, using app default`);
      return this.getDefaultAppStyle();
    } catch (error: any) {
      this.logger.error(`Error getting default punch card style for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createOrUpdateMerchantDefaultStyle(
    merchantId: string, 
    data: CreatePunchCardStyleDto | UpdatePunchCardStyleDto
  ): Promise<PunchCardStyleDto> {
    this.logger.log(`Creating or updating default punch card style for merchant: ${merchantId}`);
    
    try {
      const style = await this.punchCardStyleRepository.createOrUpdateMerchantDefaultStyle(merchantId, data);
      this.logger.log(`Created/updated default punch card style for merchant: ${merchantId}`);
      return style;
    } catch (error: any) {
      this.logger.error(`Error creating/updating default punch card style for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateMerchantDefaultLogo(merchantId: string, logoUrl: string): Promise<PunchCardStyleDto> {
    this.logger.log(`Updating default punch card logo for merchant: ${merchantId}`);
    
    try {
      const style = await this.punchCardStyleRepository.updateMerchantDefaultLogo(merchantId, logoUrl);
      this.logger.log(`Updated default punch card logo for merchant: ${merchantId}`);
      return style;
    } catch (error: any) {
      this.logger.error(`Error updating default punch card logo for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getLoyaltyProgramStyle(loyaltyProgramId: string): Promise<PunchCardStyleDto> {
    this.logger.log(`Getting punch card style for loyalty program: ${loyaltyProgramId}`);
    
    try {
      const loyaltyProgram = await this.loyaltyRepository.findLoyaltyProgramById(loyaltyProgramId);
      
      if (!loyaltyProgram) {
        throw new NotFoundException(`Loyalty program with ID ${loyaltyProgramId} not found`);
      }

      const style = await this.punchCardStyleRepository.findLoyaltyProgramStyle(loyaltyProgram.merchant_id, loyaltyProgramId);
      
      if (style) {
        this.logger.log(`Retrieved punch card style for loyalty program: ${loyaltyProgramId}`);
        return style;
      }
      
      this.logger.log(`No loyalty program style found for ${loyaltyProgramId}, falling back to merchant default`);
      return this.getMerchantDefaultStyle(loyaltyProgram.merchant_id);
    } catch (error: any) {
      this.logger.error(`Error getting punch card style for loyalty program ${loyaltyProgramId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createOrUpdateLoyaltyProgramStyle(
    loyaltyProgramId: string,
    data: CreatePunchCardStyleDto | UpdatePunchCardStyleDto
  ): Promise<PunchCardStyleDto> {
    this.logger.log(`Creating or updating punch card style for loyalty program: ${loyaltyProgramId}`);
    
    try {
      const loyaltyProgram = await this.loyaltyRepository.findLoyaltyProgramById(loyaltyProgramId);
      
      if (!loyaltyProgram) {
        throw new NotFoundException(`Loyalty program with ID ${loyaltyProgramId} not found`);
      }

      const style = await this.punchCardStyleRepository.createOrUpdateLoyaltyProgramStyle(
        loyaltyProgram.merchant_id, 
        loyaltyProgramId, 
        data
      );
      this.logger.log(`Created/updated punch card style for loyalty program: ${loyaltyProgramId}`);
      return style;
    } catch (error: any) {
      this.logger.error(`Error creating/updating punch card style for loyalty program ${loyaltyProgramId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 