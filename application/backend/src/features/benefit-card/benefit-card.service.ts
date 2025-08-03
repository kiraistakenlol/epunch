import { Injectable, Logger } from '@nestjs/common';
import { BenefitCardRepository } from './benefit-card.repository';
import { BenefitCardDto, BenefitCardCreateDto, BenefitCardCreatedEvent } from 'e-punch-common-core';
import { BenefitCardMapper } from '../../mappers';
import { EventService } from '../../events/event.service';
import { UserRepository } from '../user/user.repository';
import { Authentication, AuthorizationService } from '../../core';

@Injectable()
export class BenefitCardService {
  private readonly logger = new Logger(BenefitCardService.name);

  constructor(
    private readonly benefitCardRepository: BenefitCardRepository,
    private readonly userRepository: UserRepository,
    private readonly eventService: EventService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async getBenefitCardById(benefitCardId: string, auth: Authentication): Promise<BenefitCardDto> {
    this.logger.log(`Fetching benefit card by ID: ${benefitCardId}`);

    const benefitCard = await this.benefitCardRepository.getBenefitCardById(benefitCardId);

    this.logger.log(`Found benefit card: ${benefitCardId}`);
    return BenefitCardMapper.toDto(benefitCard);
  }

  async getUserBenefitCards(userId: string, auth: Authentication): Promise<BenefitCardDto[]> {
    this.logger.log(`Fetching benefit cards for user: ${userId}`);

    try {
      const benefitCardsWithMerchant = await this.benefitCardRepository.findUserBenefitCards(userId);

      this.logger.log(`Found ${benefitCardsWithMerchant.length} benefit cards for user: ${userId}`);
      return BenefitCardMapper.toDtoArray(benefitCardsWithMerchant);
    } catch (error: any) {
      this.logger.error(`Error fetching benefit cards for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  async createBenefitCard(data: BenefitCardCreateDto, auth: Authentication): Promise<BenefitCardDto> {
    this.logger.log(`Creating benefit card for user ${data.userId}`);

    try {
      const user = await this.userRepository.getUserById(data.userId);

      const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

      const benefitCard = await this.benefitCardRepository.createBenefitCard(
        data.userId,
        data.merchantId,
        data.itemName,
        expiresAt
      );
      
      const benefitCardWithMerchant = await this.benefitCardRepository.getBenefitCardById(benefitCard.id);
      const benefitCardDto = BenefitCardMapper.toDto(benefitCardWithMerchant);

      this.logger.log(`Emitting BENEFIT_CARD_CREATED event for user ${data.userId}, benefit card ${benefitCard.id}`);
      const benefitCardCreatedEvent: BenefitCardCreatedEvent = {
        type: 'BENEFIT_CARD_CREATED',
        userId: data.userId,
        benefitCard: benefitCardDto,
      };
      this.eventService.emitAppEvent(benefitCardCreatedEvent);

      this.logger.log(`Successfully created benefit card: ${benefitCard.id}`);
      return benefitCardDto;
    } catch (error: any) {
      this.logger.error(`Error creating benefit card for user ${data.userId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}