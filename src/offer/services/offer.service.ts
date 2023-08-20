import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomError } from 'src/error/error.interface';
import { AccountService } from 'src/account/services/account.service';
import { CreateOfferDto } from '../dtos/offer.dto';
import { OfferEntity } from '../entities/offer.entity';
import { OfferRepository } from '../repository/offer.repository';
import { OfferStatusEnum } from '../enum/offer.enum';
import {
  ERROR_MSG_CONSTANTS,
  ERROR_STATUS_CONSTANTS,
} from 'src/util/constant/error.constant';
import UtilityClass from 'src/util/helper/utility';

@Injectable()
export class OfferService {
  private logger = new Logger(OfferService.name);
  constructor(
    @InjectRepository(OfferRepository)
    private offerRepository: OfferRepository,
    private accountService: AccountService,
  ) {}

  public async updateOfferStatus(
    newStatus: OfferStatusEnum,
    offerId: string,
  ): Promise<boolean | CustomError> {
    try {
      if (newStatus == OfferStatusEnum.PENDING) {
        return new CustomError(
          '1221',
          ERROR_STATUS_CONSTANTS.INVALID_OFFER_STATUS,
          ERROR_MSG_CONSTANTS.INVALID_OFFER_STATUS_MSG,
        );
      }
      const offer = await this.findOfferById(offerId);
      if (offer instanceof CustomError) return offer;
      offer.status = newStatus;
      await this.offerRepository.updateOffer(offer);
      return true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  public async findOfferById(id: string): Promise<OfferEntity | CustomError> {
    return this.offerRepository.findOfferById(id);
  }

  public async createOffer(
    createOfferDto: CreateOfferDto,
  ): Promise<OfferEntity | CustomError> {
    const account = await this.accountService.fetchAccountById(
      createOfferDto.accountId,
    );
    if (account instanceof CustomError) return account;
    const { offerExpiryTime, offerActivationTime } = createOfferDto;
    const activationTimeGiven =
      offerActivationTime != null && offerActivationTime != undefined;
    if (!activationTimeGiven) {
      createOfferDto.offerActivationTime = new Date();
    }
    if (
      !UtilityClass.isTime1InFutureWrtTime2DateFormat(
        createOfferDto.offerActivationTime,
        offerExpiryTime,
      )
    ) {
      return new CustomError(
        '9283',
        ERROR_STATUS_CONSTANTS.EXPIRY_TIME_ERROR,
        ERROR_MSG_CONSTANTS.EXPIRY_TIME_ERROR_MSG,
      );
    }
    return this.offerRepository.createOffer(createOfferDto, account);
  }
}
