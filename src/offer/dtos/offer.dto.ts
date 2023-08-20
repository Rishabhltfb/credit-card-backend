import { LimitTypeEnum } from '../entities/offer.entity';

export class CreateOfferDto {
  accountId: string;
  limitType: LimitTypeEnum;
  newLimit: number;
  offerActivationTime: Date;
  offerExpiryTime: Date;
}
