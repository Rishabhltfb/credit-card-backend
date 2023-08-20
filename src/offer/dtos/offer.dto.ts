import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
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

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  offerActivationTime?: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  offerExpiryTime: Date;
}
export class UpdateOfferStatusDto {
  @IsEnum(OfferStatusEnum)
  status: OfferStatusEnum;
}
