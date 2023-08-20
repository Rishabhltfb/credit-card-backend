import { Logger } from '@nestjs/common';
import {
  EntityRepository,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CustomError } from 'src/error/error.interface';
import {
  ERROR_MSG_CONSTANTS,
  ERROR_STATUS_CONSTANTS,
} from 'src/util/constant/error.constant';
import { CreateOfferDto } from '../dtos/offer.dto';
import { OfferEntity } from '../entities/offer.entity';
import { OfferStatusEnum } from '../enum/offer.enum';

@EntityRepository(OfferEntity)
export class OfferRepository extends Repository<OfferEntity> {
  private logger = new Logger(OfferRepository.name);
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offerModel: Repository<OfferEntity>,
  ) {
    super();
  }

  async findOfferById(offerId: string): Promise<OfferEntity | CustomError> {
    try {
      return await this.offerModel.findOne({ id: offerId });
    } catch (error) {
      this.logger.error(
        `Failed to find offer: ${JSON.stringify(offerId)} err: ${error}`,
        error.stack,
      );
      return new CustomError(
        '9283',
        ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
        ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
      );
    }
  }

  async fetchActiveOffersByAccount(
    account: AccountEntity,
    activeDate: Date,
  ): Promise<OfferEntity[] | CustomError> {
    try {
      return await this.offerModel.find({
        where: {
          account_id: account,
          status: OfferStatusEnum.PENDING,
          offer_activation_time: LessThanOrEqual(activeDate),
          offer_expiry_time: MoreThanOrEqual(activeDate),
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to find active offers: ${JSON.stringify(
          account,
        )} err: ${error}`,
        error.stack,
      );
      return new CustomError(
        '6686',
        ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
        ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
      );
    }
  }

  async updateOffer(newOffer: OfferEntity): Promise<OfferEntity | CustomError> {
    try {
      return this.offerModel.save(newOffer);
    } catch (err) {
      return new CustomError(
        '4283',
        ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
        ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
      );
    }
  }

  async createOffer(
    createOfferDto: CreateOfferDto,
    account: AccountEntity,
  ): Promise<OfferEntity | CustomError> {
    const {
      limitType: limit_type,
      newLimit: new_limit,
      offerExpiryTime: offer_expiry_time,
      offerActivationTime: offer_activation_time,
    } = createOfferDto;

    const offerObj = {
      limit_type,
      new_limit,
      offer_expiry_time,
      account_id: account,
      offer_activation_time: offer_activation_time ?? new Date(),
    };
    const offer = this.offerModel.create(offerObj);
    try {
      return await this.offerModel.save(offer);
    } catch (error) {
      this.logger.error(
        `Failed to create offer: ${JSON.stringify(offerObj)} err: ${error}`,
        error.stack,
      );
      return new CustomError(
        '9184',
        ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
        ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
      );
    }
  }
}
