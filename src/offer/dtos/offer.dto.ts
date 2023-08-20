import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { LimitTypeEnum, OfferStatusEnum } from '../enum/offer.enum';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsEnum(LimitTypeEnum)
  limitType: LimitTypeEnum;

  @IsNumber()
  @Min(1)
  newLimit: number;

  offerActivationTime?: Date;

  @IsDate()
  offerExpiryTime: Date;
}
export class UpdateOfferStatusDto {
  @IsEnum(OfferStatusEnum)
  status: OfferStatusEnum;
}
