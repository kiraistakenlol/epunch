import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PunchCard, LoyaltyProgram, Merchant } from '../../database/entities';
import { PunchCardDto } from 'e-punch-common';

@Injectable()
export class PunchCardsRepository {
  constructor(
    @InjectRepository(PunchCard)
    private punchCardRepository: Repository<PunchCard>,
    @InjectRepository(LoyaltyProgram)
    private loyaltyProgramRepository: Repository<LoyaltyProgram>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
  ) {}

  async findPunchCardsByUserId(userId: string): Promise<PunchCardDto[]> {
    // Get all punch cards for the user
    const punchCards = await this.punchCardRepository
      .createQueryBuilder('punchCard')
      .where('punchCard.user_id = :userId', { userId })
      .getMany();

    // Return empty array if no punch cards are found
    if (!punchCards.length) {
      return [];
    }

    // Extract loyalty program IDs to fetch in bulk
    const loyaltyProgramIds = punchCards.map(card => card.loyalty_program_id);

    // Get all related loyalty programs in one query
    const loyaltyPrograms = await this.loyaltyProgramRepository
      .createQueryBuilder('loyaltyProgram')
      .where('loyaltyProgram.id IN (:...ids)', { ids: loyaltyProgramIds })
      .getMany();

    // Create a mapping of loyalty program IDs to loyalty programs for quick lookup
    const loyaltyProgramMap = loyaltyPrograms.reduce((map, program) => {
      map[program.id] = program;
      return map;
    }, {} as Record<string, LoyaltyProgram>);

    // Extract merchant IDs to fetch in bulk
    const merchantIds = loyaltyPrograms.map(program => program.merchant_id);

    // Get all related merchants in one query
    const merchants = await this.merchantRepository
      .createQueryBuilder('merchant')
      .where('merchant.id IN (:...ids)', { ids: merchantIds })
      .getMany();

    // Create a mapping of merchant IDs to merchants for quick lookup
    const merchantMap = merchants.reduce((map, merchant) => {
      map[merchant.id] = merchant;
      return map;
    }, {} as Record<string, Merchant>);

    // Map the data to DTOs
    return punchCards.map(card => {
      const loyaltyProgram = loyaltyProgramMap[card.loyalty_program_id];
      const merchant = merchantMap[loyaltyProgram.merchant_id];
      
      return {
        shopName: merchant.name,
        shopAddress: merchant.address,
        currentPunches: card.current_punches,
        totalPunches: loyaltyProgram.required_punches,
      };
    });
  }
} 