export type QRValueType = 'user_id' | 'redemption_punch_card_id';

export interface QRValueUserIdDto {
  type: 'user_id';
  user_id: string;
}

export interface QRValuePunchCardIdDto {
  type: 'redemption_punch_card_id';
  punch_card_id: string;
}

export type QRValueDto = QRValueUserIdDto | QRValuePunchCardIdDto; 