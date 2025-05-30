import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PunchCardsRepository } from './punch-cards.repository';
import { PunchCardDto } from 'e-punch-common-core';
import { EventService } from '../../events/event.service';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class PunchCardsService {
  private readonly logger = new Logger(PunchCardsService.name);

  constructor(
    private readonly punchCardsRepository: PunchCardsRepository,
    private readonly eventService: EventService,
    private readonly userRepository: UserRepository
  ) {}

  async getUserPunchCards(userId: string): Promise<PunchCardDto[]> {
    this.logger.log(`Fetching punch cards for user: ${userId}`);
    
    try {
      const punchCards = await this.punchCardsRepository.findPunchCardsByUserId(userId);
      this.logger.log(`Found ${punchCards.length} punch cards for user: ${userId}`);
      return punchCards;
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
      
      const userId = await this.punchCardsRepository.getUserIdFromPunchCard(punchCardId);
      
      if (!userId) {
        throw new NotFoundException(`User ID not found for punch card ${punchCardId}`);
      }
      
      this.logger.log(`Emitting REWARD_CLAIMED event for user ${userId}, card ${punchCardId}`);
      this.eventService.emitAppEvent({
        type: 'REWARD_CLAIMED',
        userId,
        card: updatedPunchCard,
      });
      
      this.logger.log(`Successfully redeemed punch card: ${punchCardId}`);
      return updatedPunchCard;
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
      
      this.logger.log(`Found punch card: ${punchCardId}`);
      return punchCard;
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
        const existingPunchCard = await this.punchCardsRepository.findPunchCardById(existingCard.id);
        if (!existingPunchCard) {
          throw new NotFoundException(`Punch card with ID ${existingCard.id} not found`);
        }
        return existingPunchCard;
      }

      const createdCard = await this.punchCardsRepository.createPunchCard(userId, loyaltyProgramId);
      const punchCard = await this.punchCardsRepository.findPunchCardById(createdCard.id);
      
      if (!punchCard) {
        throw new NotFoundException(`Created punch card with ID ${createdCard.id} not found`);
      }
      
      this.logger.log(`Successfully created punch card: ${createdCard.id}`);
      return punchCard;
    } catch (error: any) {
      this.logger.error(`Error creating punch card for user ${userId}, loyalty program ${loyaltyProgramId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 