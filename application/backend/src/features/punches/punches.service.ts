import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePunchDto, PunchOperationResultDto, PunchCardDto } from 'e-punch-common';
import { PunchCardsRepository } from '../punch-cards/punch-cards.repository';
import { LoyaltyRepository } from '../loyalty/loyalty.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class PunchesService {
  private readonly logger = new Logger(PunchesService.name);

  constructor(
    private readonly punchCardsRepository: PunchCardsRepository,
    private readonly loyaltyRepository: LoyaltyRepository,
    private readonly userRepository: UserRepository,
  ) { }

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
      this.logger.log(`User ${userId} not found. Attempting to create.`);
      user = await this.userRepository.createUserWithId(userId);
      if (!user) {
        this.logger.error(`Failed to find or create user ${userId}. Aborting punch operation.`);
        throw new NotFoundException(`Failed to find or create user ${userId}. Punch operation cannot proceed.`);
      }
      this.logger.log(`User ${userId} created successfully.`);
    } else {
      this.logger.log(`User ${userId} found.`);
    }

    const loyaltyProgram = await this.loyaltyRepository.findLoyaltyProgramById(loyaltyProgramId);
    if (!loyaltyProgram) {
      this.logger.warn(`Loyalty program ${loyaltyProgramId} not found.`);
      throw new NotFoundException(`Loyalty program ${loyaltyProgramId} not found.`);
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

    let newPunchCardDto: PunchCardDto | undefined = undefined;

    if (newStatus === 'REWARD_READY') {
      this.logger.log(
        `Reward achieved for card ${updatedPunchCard.id}. Current punches: ${newPunchCount}. ` +
        `Required: ${loyaltyProgram.required_punches}. Creating new active card.`
      );

      const newActiveCardEntity =
        await this.punchCardsRepository.createPunchCard(userId, loyaltyProgramId);

      this.logger.log(`New active card ${newActiveCardEntity.id} created for user ${userId}, program ${loyaltyProgramId}.`);

      const merchant = await this.loyaltyRepository.findMerchantById(loyaltyProgram.merchant_id);
      if (!merchant) {
        this.logger.error(`Merchant ${loyaltyProgram.merchant_id} not found for loyalty program ${loyaltyProgramId}.`);
        throw new NotFoundException(`Merchant details not found for loyalty program ${loyaltyProgramId}. Critical data missing.`);
      }
      newPunchCardDto = {
        id: newActiveCardEntity.id,
        shopName: merchant.name,
        shopAddress: merchant.address || 'Address Unavailable',
        currentPunches: newActiveCardEntity.current_punches,
        totalPunches: loyaltyProgram.required_punches,
        status: 'ACTIVE',
      };
    }

    this.logger.log(
      `Punch operation complete for card ${updatedPunchCard.id}. ` +
      `New punch count: ${newPunchCount}. Reward achieved: ${rewardAchieved}. ` +
      `New active card created: ${newPunchCardDto ? newPunchCardDto.id : 'No'}`
    );

    return {
      rewardAchieved,
      newPunchCard: newPunchCardDto,
      required_punches: loyaltyProgram.required_punches,
      current_punches: newPunchCount
    };
  }
} 