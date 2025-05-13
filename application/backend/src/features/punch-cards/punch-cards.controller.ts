import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PunchCardDto } from 'e-punch-common';

@Controller('api/v1/users/:userId/punch-cards')
export class PunchCardsController {
  @Get()
  async getUserPunchCards(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PunchCardDto[]> { // Directly return the array of DTOs
    console.log(`Fetching punch cards for userId: ${userId}`); // For logging/debugging

    // Mock data - replace with actual data fetching logic later
    const mockPunchCards: PunchCardDto[] = [
      {
        shopName: 'The Cozy Corner Cafe',
        shopAddress: '123 Main St, Anytown',
        currentPunches: 3,
        totalPunches: 10,
      },
      {
        shopName: 'Bookworm\'s Paradise',
        shopAddress: '456 Oak Ave, Anytown',
        currentPunches: 7,
        totalPunches: 8,
      },
      {
        shopName: 'Quick Bites Deli',
        shopAddress: '789 Pine Ln, Anytown',
        currentPunches: 1,
        totalPunches: 5,
      },
    ];

    // Simulate some delay if needed for testing loading states on frontend
    // await new Promise(resolve => setTimeout(resolve, 500));

    return mockPunchCards;
  }
} 