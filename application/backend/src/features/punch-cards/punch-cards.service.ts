import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PunchCardsRepository } from './punch-cards.repository';
import { PunchCardDto, CreatePunchDto, PunchOperationResultDto } from 'e-punch-common-core';
import { EventService } from '../../events/event.service';
import { UserRepository } from '../user/user.repository';
import { MerchantRepository } from '../merchant/merchant.repository';
import { LoyaltyRepository } from '../loyalty/loyalty.repository';
import { PunchCardMapper } from '../../mappers';
import { PunchCardStyleService } from '../punch-card-style/punch-card-style.service';

@Injectable()
export class PunchCardsService {
  private readonly logger = new Logger(PunchCardsService.name);

  constructor(
    private readonly punchCardsRepository: PunchCardsRepository,
    private readonly eventService: EventService,
    private readonly userRepository: UserRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly loyaltyRepository: LoyaltyRepository,
    private readonly punchCardStyleService: PunchCardStyleService
  ) {}

  async getUserPunchCards(userId: string): Promise<PunchCardDto[]> {
    this.logger.log(`Fetching punch cards for user: ${userId}`);
    
    try {
      const punchCardDetails = await this.punchCardsRepository.findPunchCardDetailsByUserId(userId);
      this.logger.log(`Found ${punchCardDetails.length} punch cards for user: ${userId}`);
      
      return punchCardDetails.map(detail => PunchCardMapper.detailToDto(detail));
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
      
      const styles = await this.punchCardStyleService.getPunchCardStyles(punchCardId, loyaltyProgram.id, merchant.id);
      const updatedPunchCardDto = PunchCardMapper.basicToDto(
        updatedPunchCard,
        merchant.name,
        merchant.address,
        loyaltyProgram.required_punches,
        styles
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
      const styles = await this.punchCardStyleService.getPunchCardStyles(punchCardId, loyaltyProgram.id, merchant.id);
      return PunchCardMapper.basicToDto(
        punchCard,
        merchant.name,
        merchant.address,
        loyaltyProgram.required_punches,
        styles
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
        
        const styles = await this.punchCardStyleService.getPunchCardStyles(existingCard.id, loyaltyProgram.id, merchant.id);
        return PunchCardMapper.basicToDto(
          existingCard,
          merchant.name,
          merchant.address,
          loyaltyProgram.required_punches,
          styles
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
      const styles = await this.punchCardStyleService.getPunchCardStyles(createdCard.id, loyaltyProgram.id, merchant.id);
      return PunchCardMapper.basicToDto(
        createdCard,
        merchant.name,
        merchant.address,
        loyaltyProgram.required_punches,
        styles
      );
    } catch (error: any) {
      this.logger.error(`Error creating punch card for user ${userId}, loyalty program ${loyaltyProgramId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Records a punch for a user on a loyalty program.
   * Finds an active card or creates a new one if none exists. Increments punches on the active card.
   * If the punch results in a reward, the card's status is explicitly updated,
   * and a new, empty active card is created for the same loyalty program to allow continued punch accumulation.
   * Logs the punch and returns the new punch count and reward status for the punched card.
   */
  async recordPunch(createPunchDto: CreatePunchDto): Promise<PunchOperationResultDto> {
    const { userId, loyaltyProgramId } = createPunchDto;
    this.logger.log(`Attempting to record punch for user ${userId} on loyalty program ${loyaltyProgramId}`);

    if (!userId || !loyaltyProgramId) {
      throw new BadRequestException('UserId and LoyaltyProgramId are required.');
    }

    let user = await this.userRepository.findUserById(userId);
    if (!user) {
      user = await this.userRepository.createAnonymousUser(userId);
    }

    const loyaltyProgram = await this.loyaltyRepository.findLoyaltyProgramById(loyaltyProgramId);
    if (!loyaltyProgram) {
      throw new BadRequestException(`Loyalty program ${loyaltyProgramId} not found.`);
    }

    let activePunchCard = await this.punchCardsRepository.findTop1PunchCardByUserIdAndLoyaltyProgramIdAndStatusOrderByCreatedAtDesc(
      userId,
      loyaltyProgramId,
      'ACTIVE'
    );

    if (activePunchCard) {
      this.logger.log(
        `Found existing latest active punch card ${activePunchCard.id} (punches: ${activePunchCard.current_punches}) ` +
        `for user ${userId}, program ${loyaltyProgramId}.`
      );
    } else {
      this.logger.log(
        `No active punch card found for user ${userId}, program ${loyaltyProgramId} (requires ${loyaltyProgram.required_punches} punches). ` +
        `Creating new one.`
      );
      activePunchCard = await this.punchCardsRepository.createPunchCard(userId, loyaltyProgramId);
      this.logger.log(`New punch card ${activePunchCard.id} created.`);
    }

    const newPunchCount = activePunchCard.current_punches + 1;
    const rewardAchieved = newPunchCount >= loyaltyProgram.required_punches;

    const newStatus = rewardAchieved ? 'REWARD_READY' : activePunchCard.status;

    const updatedPunchCard = await this.punchCardsRepository.updatePunchCardPunchesAndStatus(
      activePunchCard.id,
      newPunchCount,
      newStatus
    );

    await this.punchCardsRepository.createPunchRecord(updatedPunchCard.id);

    const merchant = await this.merchantRepository.findMerchantById(loyaltyProgram.merchant_id);
    if (!merchant) {
      this.logger.error(`Merchant ${loyaltyProgram.merchant_id} not found for loyalty program ${loyaltyProgramId}.`);
      throw new BadRequestException(`Merchant details not found for loyalty program ${loyaltyProgramId}. Critical data missing.`);
    }

    let newPunchCardDto: PunchCardDto | undefined = undefined;

    if (newStatus === 'REWARD_READY') {
      this.logger.log(
        `Reward achieved for card ${updatedPunchCard.id}. Current punches: ${newPunchCount}. ` +
        `Required: ${loyaltyProgram.required_punches}. Creating new active card.`
      );

      const newActiveCardEntity =
        await this.punchCardsRepository.createPunchCard(userId, loyaltyProgramId);

      this.logger.log(`New active card ${newActiveCardEntity.id} created for user ${userId}, program ${loyaltyProgramId}.`);

      const newCardStyles = await this.punchCardStyleService.getPunchCardStyles(newActiveCardEntity.id, loyaltyProgram.id, merchant.id);
      newPunchCardDto = PunchCardMapper.basicToDto(
        newActiveCardEntity,
        merchant.name,
        merchant.address,
        loyaltyProgram.required_punches,
        newCardStyles
      );
    }

    this.logger.log(
      `Punch operation complete for card ${updatedPunchCard.id}. ` +
      `New punch count: ${newPunchCount}. Reward achieved: ${rewardAchieved}. ` +
      `New active card created: ${newPunchCardDto ? newPunchCardDto.id : 'No'}`
    );
    
    const updatedCardStyles = await this.punchCardStyleService.getPunchCardStyles(updatedPunchCard.id, loyaltyProgram.id, merchant.id);
    const updatedPunchCardDto = PunchCardMapper.basicToDto(
      updatedPunchCard,
      merchant.name,
      merchant.address,
      loyaltyProgram.required_punches,
      updatedCardStyles
    );

    this.logger.log(`Emitting PUNCH_ADDED event for user ${userId}, card ${updatedPunchCard.id}`);
    this.eventService.emitAppEvent({
      type: 'PUNCH_ADDED',
      userId,
      punchCard: updatedPunchCardDto,
      newCard: newPunchCardDto || null,
    });

    return {
      rewardAchieved,
      newPunchCard: newPunchCardDto,
      required_punches: loyaltyProgram.required_punches,
      current_punches: newPunchCount
    };
  }
} 