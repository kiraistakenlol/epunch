export interface PunchOperationResultDto {
  message: string;
  currentPunches: number;
  totalPunches: number;
  rewardAchieved: boolean;
  rewardDescription?: string;
} 