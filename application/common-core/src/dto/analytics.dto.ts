export interface QuickOverviewDto {
  totalUsers: number;
  totalPunches: number;
  totalCards: number;
  rewardsRedeemed: number;
  totalUsersGrowth: number;
  totalCardsGrowth: number;
  totalPunchesGrowth: number;
  rewardsRedeemedGrowth: number;
}

export interface UsersAnalyticsDto {
  registeredUsers: number;
  anonymousUsers: number;
  totalUsers: number
}

export interface CardsAnalyticsDto {
  activeCards: number;
  rewardReadyCards: number;
  rewardRedeemedCards: number;
  totalCards: number;
}

export interface GrowthTrendDataPoint {
  date: string;
  totalUsers: number;
  totalPunches: number;
  totalCards: number;
  totalRewardsRedeemed: number;
}

export interface GrowthTrendsDto {
  data: GrowthTrendDataPoint[];
}

export interface ActivityTrendDataPoint {
  date: string;
  newCustomers: number;
  punches: number;
  rewardsRedeemed: number;
  newCards: number;
}

export interface ActivityTrendsDto {
  data: ActivityTrendDataPoint[];
}

export interface DaysOfWeekDataPoint {
  day: string;
  newCustomers: number;
  punches: number;
  rewardsRedeemed: number;
  newCards: number;
}

export interface DaysOfWeekAnalyticsDto {
  data: DaysOfWeekDataPoint[];
}

export interface LoyaltyProgramAnalyticsDto {
  data: ProgramStats[];
} 