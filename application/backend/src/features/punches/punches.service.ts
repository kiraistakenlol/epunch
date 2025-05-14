import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePunchDto, PunchOperationResultDto } from 'e-punch-common';
import { PunchCardsRepository } from '../punch-cards/punch-cards.repository';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';
import { Database } from '../punch-cards/types/database.types'; // Assuming this path is correct

@Injectable()
export class PunchesService {
  private readonly logger = new Logger(PunchesService.name);

  constructor(
    private readonly punchCardsRepository: PunchCardsRepository,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient<Database> // For direct punch record creation
  ) {}

  async recordPunch(createPunchDto: CreatePunchDto): Promise<PunchOperationResultDto> {
    const { userId, loyaltyProgramId } = createPunchDto;
    this.logger.log(`Attempting to record punch for user ${userId} on loyalty program ${loyaltyProgramId}`);

    if (!userId || !loyaltyProgramId) {
      throw new BadRequestException('UserId and LoyaltyProgramId are required.');
    }

    const loyaltyProgram = await this.punchCardsRepository.findLoyaltyProgramById(loyaltyProgramId);
    if (!loyaltyProgram) {
      this.logger.warn(`Loyalty program ${loyaltyProgramId} not found.`);
      throw new NotFoundException(`Loyalty program ${loyaltyProgramId} not found.`);
    }

    // Find the latest active punch card for this user and loyalty program
    let punchCard = await this.punchCardsRepository.findPunchCardByUserIdAndLoyaltyProgramId(
      userId,
      loyaltyProgramId,
      loyaltyProgram.required_punches // Pass required_punches to filter for active cards
    );

    if (punchCard) {
      // An active punch card was found.
      this.logger.log(
        `Found existing latest active punch card ${punchCard.id} (punches: ${punchCard.current_punches}) ` +
        `for user ${userId}, program ${loyaltyProgramId}.`
      );
      // No need to check if it's full, as the repository method only returns active ones.
    } else {
      // No active punch card found for this loyalty program. Create a new one.
      this.logger.log(
        `No active punch card found for user ${userId}, program ${loyaltyProgramId} (requires ${loyaltyProgram.required_punches} punches). ` +
        `Creating new one.`
      );
      punchCard = await this.punchCardsRepository.createPunchCard(userId, loyaltyProgramId, 0); // Starts with 0 punches
      this.logger.log(`New punch card ${punchCard.id} created.`);
    }

    // At this point, punchCard is either an existing active card or a newly created one.
    const newPunchCount = punchCard.current_punches + 1;
    const updatedCardEntity = await this.punchCardsRepository.updatePunchCardPunches(
      punchCard.id,
      newPunchCount,
    );

    await this.punchCardsRepository.createPunchRecord(updatedCardEntity.id);

    const rewardAchieved = newPunchCount >= loyaltyProgram.required_punches;
    let message = 'Punch recorded successfully.';
    if (rewardAchieved) {
      message = `Punch recorded! Reward: ${loyaltyProgram.reward_description} achieved!`;
    }
    
    this.logger.log(`Punch recorded for card ${updatedCardEntity.id}. New count: ${newPunchCount}. Reward achieved: ${rewardAchieved}`);

    return {
      message,
      currentPunches: newPunchCount,
      totalPunches: loyaltyProgram.required_punches,
      rewardAchieved,
      rewardDescription: rewardAchieved ? loyaltyProgram.reward_description : undefined,
    };
  }
} 