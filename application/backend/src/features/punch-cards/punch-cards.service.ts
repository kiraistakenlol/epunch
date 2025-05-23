import { Injectable, Logger } from '@nestjs/common';
import { PunchCardsRepository } from './punch-cards.repository';
import { PunchCardDto } from 'e-punch-common-core';

@Injectable()
export class PunchCardsService {
  private readonly logger = new Logger(PunchCardsService.name);

  constructor(private readonly punchCardsRepository: PunchCardsRepository) {}

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
} 