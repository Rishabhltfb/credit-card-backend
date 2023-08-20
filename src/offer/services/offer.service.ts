import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomError } from 'src/error/error.interface';
import { AccountService } from 'src/account/services/account.service';
import { CreateOfferDto } from '../dtos/offer.dto';
import { OfferEntity } from '../entities/offer.entity';
import { OfferRepository } from '../repository/offer.repository';
import { LimitTypeEnum, OfferStatusEnum } from '../enum/offer.enum';
import {
  ERROR_MSG_CONSTANTS,
  ERROR_STATUS_CONSTANTS,
} from 'src/util/constant/error.constant';
import UtilityClass from 'src/util/helper/utility';
import { UpdateAccountDto } from 'src/account/dtos/account.dto';

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
  ): Promise<string | CustomError> {
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
      if (offer == null || offer === undefined) {
        return new CustomError(
          '2933',
          'OFFER_NOT_FOUND',
          'Unable to find offer for this id',
        );
      }
      offer.status = newStatus;
      if (newStatus == OfferStatusEnum.ACCEPTED) {
        const { new_limit, limit_type } = offer;
        const updateAccountDto: UpdateAccountDto = {};
        if (limit_type == LimitTypeEnum.ACCOUNT_LIMIT) {
          updateAccountDto.newAccountLimit = new_limit;
        } else {
          updateAccountDto.newPerTransactionLimit = new_limit;
        }
        const updatedAccount = await this.accountService.updateAccountLimits(
          offer.account_id.account_id,
          updateAccountDto,
        );
        if (updatedAccount instanceof CustomError) return updatedAccount;
      }
      const updatedOffer = await this.offerRepository.updateOffer(offer);
      if (updatedOffer instanceof CustomError) return updatedOffer;
      return 'Offer status successfully updated!';
    } catch (err) {
      this.logger.error(err);
      return new CustomError(
        '9089',
        ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
        ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
      );
    }
  }

  public async fetchActiveOffersforAccount(
    accountId: string,
    activeDate: Date,
  ): Promise<OfferEntity[] | CustomError> {
    try {
      const account = await this.accountService.fetchAccountById(accountId);
      if (account instanceof CustomError) return account;
      const offers = await this.offerRepository.fetchActiveOffersByAccount(
        account,
        activeDate,
      );
      return offers;
    } catch (err) {
      return new CustomError(
        '5473',
        ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
        ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
      );
    }
  }

  public async findOfferById(id: string): Promise<OfferEntity | CustomError> {
    try {
      return this.offerRepository.findOfferById(id);
    } catch (err) {
      return new CustomError(
        '7273',
        ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
        ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
      );
    }
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
    let activationTime;
    const expiryTime = new Date(offerExpiryTime);
    if (!activationTimeGiven) {
      activationTime = new Date();
    } else {
      activationTime = new Date(offerActivationTime);
    }
    if (
      !UtilityClass.isTime2InFutureWrtTime1DateFormat(
        activationTime,
        expiryTime,
      )
    ) {
      return new CustomError(
        '9283',
        ERROR_STATUS_CONSTANTS.EXPIRY_TIME_ERROR,
        ERROR_MSG_CONSTANTS.EXPIRY_TIME_ERROR_MSG,
      );
    }
    createOfferDto.offerActivationTime = activationTime;
    createOfferDto.offerExpiryTime = expiryTime;
    return this.offerRepository.createOffer(createOfferDto, account);
  }
}
