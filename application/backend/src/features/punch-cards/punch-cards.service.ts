import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PunchCardsRepository } from './punch-cards.repository';
import { PunchCardDto } from 'e-punch-common-core';
import { EventService } from '../../events/event.service';

@Injectable()
export class PunchCardsService {
  private readonly logger = new Logger(PunchCardsService.name);

  constructor(
    private readonly punchCardsRepository: PunchCardsRepository,
    private readonly eventService: EventService
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
} 