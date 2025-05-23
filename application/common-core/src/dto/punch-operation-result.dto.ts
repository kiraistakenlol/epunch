import { PunchCardDto } from './punch-card.dto';

export interface PunchOperationResultDto {
  rewardAchieved: boolean;
  newPunchCard?: PunchCardDto;
  required_punches: number;
  current_punches: number;
} 