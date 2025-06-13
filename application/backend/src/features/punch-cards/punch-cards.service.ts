import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PunchCardsRepository } from './punch-cards.repository';
import { PunchCardDto } from 'e-punch-common-core';
import { EventService } from '../../events/event.service';
import { UserRepository } from '../user/user.repository';
import { MerchantRepository } from '../merchant/merchant.repository';
import { LoyaltyRepository } from '../loyalty/loyalty.repository';
import { PunchCardMapper } from '../../mappers';

@Injectable()
export class PunchCardsService {
  private readonly logger = new Logger(PunchCardsService.name);

  constructor(
    private readonly punchCardsRepository: PunchCardsRepository,
    private readonly eventService: EventService,
    private readonly userRepository: UserRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly loyaltyRepository: LoyaltyRepository
  ) {}

  async getUserPunchCards(userId: string): Promise<PunchCardDto[]> {
    this.logger.log(`Fetching punch cards for user: ${userId}`);
    
    try {
      const punchCards = await this.punchCardsRepository.findPunchCardsByUserId(userId);
      this.logger.log(`Found ${punchCards.length} punch cards for user: ${userId}`);
      
      const punchCardDtos: PunchCardDto[] = [];
      
      for (const punchCard of punchCards) {
        const loyaltyProgram = await this.loyaltyRepository.findLoyaltyProgramById(punchCard.loyalty_program_id);
        if (!loyaltyProgram) {
          this.logger.warn(`Loyalty program not found for punch card ${punchCard.id}`);
          continue;
        }
        
        const merchant = await this.merchantRepository.findMerchantById(loyaltyProgram.merchant_id);
        if (!merchant) {
          this.logger.warn(`Merchant not found for punch card ${punchCard.id}`);
          continue;
        }
        
        const dto = PunchCardMapper.basicToDto(
          punchCard,
          merchant.name,
          merchant.address,
          loyaltyProgram.required_punches
        );
        punchCardDtos.push(dto);
      }
      
      return punchCardDtos;
    } catch (error: any) {
      this.logger.error(`Error fetching punch cards for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async redeemPunchCard(punchCardId: string): Promise<PunchCardDto> {
    this.logger.log(`Attempting to redeem punch card: ${punchCardId}`);
    
    try {
      const punchCard = await this.punchCardsRepository.findPunchCardById(punchCardId);
      
      if (!punchCard) {
        throw new NotFoundException(`Punch card with ID ${punchCardId} not found`);
      }

      if (punchCard.status !== 'REWARD_READY') {
        throw new BadRequestException(`Punch card ${punchCardId} is not ready for redemption. Current status: ${punchCard.status}`);
      }

      const updatedPunchCard = await this.punchCardsRepository.updatePunchCardStatus(punchCardId, 'REWARD_REDEEMED');
      
      const loyaltyProgram = await this.loyaltyRepository.findLoyaltyProgramById(updatedPunchCard.loyalty_program_id);
      if (!loyaltyProgram) {
        throw new NotFoundException(`Loyalty program not found for punch card ${punchCardId}`);
      }
      
      const merchant = await this.merchantRepository.findMerchantById(loyaltyProgram.merchant_id);
      if (!merchant) {
        throw new NotFoundException(`Merchant not found for punch card ${punchCardId}`);
      }
      
      const updatedPunchCardDto = PunchCardMapper.basicToDto(
        updatedPunchCard,
        merchant.name,
        merchant.address,
        loyaltyProgram.required_punches
      );
      
      const userId = await this.punchCardsRepository.getUserIdFromPunchCard(punchCardId);
      
      if (!userId) {
        throw new NotFoundException(`User ID not found for punch card ${punchCardId}`);
      }
      
      this.logger.log(`Emitting REWARD_CLAIMED event for user ${userId}, card ${punchCardId}`);
      this.eventService.emitAppEvent({
        type: 'REWARD_CLAIMED',
        userId,
        card: updatedPunchCardDto,
      });
      
      this.logger.log(`Successfully redeemed punch card: ${punchCardId}`);
      return updatedPunchCardDto;
    } catch (error: any) {
      this.logger.error(`Error redeeming punch card ${punchCardId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getPunchCard(punchCardId: string): Promise<PunchCardDto> {
    this.logger.log(`Fetching punch card: ${punchCardId}`);
    
    try {
      const punchCard = await this.punchCardsRepository.findPunchCardById(punchCardId);
      
      if (!punchCard) {
        throw new NotFoundException(`Punch card with ID ${punchCardId} not found`);
      }
      
      const loyaltyProgram = await this.loyaltyRepository.findLoyaltyProgramById(punchCard.loyalty_program_id);
      if (!loyaltyProgram) {
        throw new NotFoundException(`Loyalty program not found for punch card ${punchCardId}`);
      }
      
      const merchant = await this.merchantRepository.findMerchantById(loyaltyProgram.merchant_id);
      if (!merchant) {
        throw new NotFoundException(`Merchant not found for punch card ${punchCardId}`);
      }
      
      this.logger.log(`Found punch card: ${punchCardId}`);
      return PunchCardMapper.basicToDto(
        punchCard,
        merchant.name,
        merchant.address,
        loyaltyProgram.required_punches
      );
    } catch (error: any) {
      this.logger.error(`Error fetching punch card ${punchCardId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createPunchCard(userId: string, loyaltyProgramId: string): Promise<PunchCardDto> {
    this.logger.log(`Creating punch card for user ${userId} and loyalty program ${loyaltyProgramId}`);
    
    try {
      let user = await this.userRepository.findUserById(userId);
      if (!user) {
        user = await this.userRepository.createAnonymousUser(userId);
      }

      const existingCard = await this.punchCardsRepository.findTop1PunchCardByUserIdAndLoyaltyProgramIdAndStatusOrderByCreatedAtDesc(
        userId,
        loyaltyProgramId,
        'ACTIVE'
      );
      
      if (existingCard) {
        this.logger.log(`Active punch card already exists for user ${userId} and loyalty program ${loyaltyProgramId}: ${existingCard.id}`);
        
        const loyaltyProgram = await this.loyaltyRepository.findLoyaltyProgramById(loyaltyProgramId);
        if (!loyaltyProgram) {
          throw new NotFoundException(`Loyalty program not found: ${loyaltyProgramId}`);
        }
        
        const merchant = await this.merchantRepository.findMerchantById(loyaltyProgram.merchant_id);
        if (!merchant) {
          throw new NotFoundException(`Merchant not found for loyalty program ${loyaltyProgramId}`);
        }
        
        return PunchCardMapper.basicToDto(
          existingCard,
          merchant.name,
          merchant.address,
          loyaltyProgram.required_punches
        );
      }

      const createdCard = await this.punchCardsRepository.createPunchCard(userId, loyaltyProgramId);
      
      const loyaltyProgram = await this.loyaltyRepository.findLoyaltyProgramById(loyaltyProgramId);
      if (!loyaltyProgram) {
        throw new NotFoundException(`Loyalty program not found: ${loyaltyProgramId}`);
      }
      
      const merchant = await this.merchantRepository.findMerchantById(loyaltyProgram.merchant_id);
      if (!merchant) {
        throw new NotFoundException(`Merchant not found for loyalty program ${loyaltyProgramId}`);
      }
      
      this.logger.log(`Successfully created punch card: ${createdCard.id}`);
      return PunchCardMapper.basicToDto(
        createdCard,
        merchant.name,
        merchant.address,
        loyaltyProgram.required_punches
      );
    } catch (error: any) {
      this.logger.error(`Error creating punch card for user ${userId}, loyalty program ${loyaltyProgramId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 