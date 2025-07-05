import { Injectable, Logger } from '@nestjs/common';
import { PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core';
import { PunchCardStyleRepository } from './punch-card-style.repository';
import { PunchCardStyleMapper } from '../../mappers/punch-card-style.mapper';


@Injectable()
export class PunchCardStyleService {
  private readonly logger = new Logger(PunchCardStyleService.name);

  constructor(
    private readonly punchCardStyleRepository: PunchCardStyleRepository,
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
        return PunchCardStyleMapper.toDto(loyaltyProgramStyle);
      }
      
      this.logger.log(`No loyalty program style found, trying merchant default for punch card: ${punchCardId}`);
      const merchantStyle = await this.getMerchantDefaultStyle(merchantId);
      
      if (merchantStyle) {
        return merchantStyle;
      }
      
      this.logger.log(`No merchant style found, using app default for punch card: ${punchCardId}`);
      return this.getDefaultAppStyle();
    } catch (error: any) {
      this.logger.error(`Error getting punch card styles for ${punchCardId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getDefaultAppStyle(): Promise<PunchCardStyleDto> {
    this.logger.log('Getting default app-wide punch card style');
    
    return {
      primaryColor: null,
      secondaryColor: null,
      logoUrl: null,
      backgroundImageUrl: null,
      punchIcons: null,
    };
  }

  async getMerchantDefaultStyle(merchantId: string): Promise<PunchCardStyleDto | null> {
    this.logger.log(`Getting default punch card style for merchant: ${merchantId}`);
    
    try {
      const style = await this.punchCardStyleRepository.findMerchantDefaultStyle(merchantId);
      
      if (style) {
        this.logger.log(`Retrieved default punch card style for merchant: ${merchantId}`);
        return PunchCardStyleMapper.toDto(style);
      }
      
      this.logger.log(`No merchant style found for ${merchantId}`);
      return null;
    } catch (error: any) {
      this.logger.error(`Error getting default punch card style for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createOrUpdateMerchantDefaultStyle(
    merchantId: string, 
    data: PunchCardStyleDto
  ): Promise<PunchCardStyleDto> {
    this.logger.log(`Creating or updating default punch card style for merchant: ${merchantId}`);
    
    try {
      const style = await this.punchCardStyleRepository.createOrUpdateMerchantDefaultStyle(merchantId, data);
      this.logger.log(`Created/updated default punch card style for merchant: ${merchantId}`);
      return PunchCardStyleMapper.toDto(style);
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
      return PunchCardStyleMapper.toDto(style);
    } catch (error: any) {
      this.logger.error(`Error updating default punch card logo for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getLoyaltyProgramStyle(loyaltyProgramId: string, merchantId: string): Promise<PunchCardStyleDto | null> {
    this.logger.log(`Getting punch card style for loyalty program: ${loyaltyProgramId}`);
    
    try {
      const style = await this.punchCardStyleRepository.findLoyaltyProgramStyle(merchantId, loyaltyProgramId);
      
      if (style) {
        this.logger.log(`Retrieved punch card style for loyalty program: ${loyaltyProgramId}`);
        return PunchCardStyleMapper.toDto(style);
      }
      
      this.logger.log(`No loyalty program style found for ${loyaltyProgramId}`);
      return null;
    } catch (error: any) {
      this.logger.error(`Error getting punch card style for loyalty program ${loyaltyProgramId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createOrUpdateLoyaltyProgramStyle(
    loyaltyProgramId: string,
    merchantId: string,
    data: PunchCardStyleDto
  ): Promise<PunchCardStyleDto> {
    this.logger.log(`Creating or updating punch card style for loyalty program: ${loyaltyProgramId}`);
    
    try {
      const style = await this.punchCardStyleRepository.createOrUpdateLoyaltyProgramStyle(
        merchantId, 
        loyaltyProgramId, 
        data
      );
      this.logger.log(`Created/updated punch card style for loyalty program: ${loyaltyProgramId}`);
      return PunchCardStyleMapper.toDto(style);
    } catch (error: any) {
      this.logger.error(`Error creating/updating punch card style for loyalty program ${loyaltyProgramId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 