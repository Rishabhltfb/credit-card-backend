import { LimitTypeEnum, OfferStatusEnum } from '../enum/offer.enum';

export class CreateOfferDto {
  accountId: string;
  limitType: LimitTypeEnum;
  newLimit: number;
  offerActivationTime?: Date;
  offerExpiryTime: Date;
}
export class UpdateOfferStatusDto {
  status: OfferStatusEnum;
}
