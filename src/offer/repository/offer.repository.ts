import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CustomError } from 'src/error/error.interface';
import { CreateOfferDto } from '../dtos/offer.dto';
import { OfferEntity } from '../entities/offer.entity';

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
      throw new InternalServerErrorException();
    }
  }

  async updateOffer(newOffer: OfferEntity): Promise<OfferEntity> {
    return this.offerModel.save(newOffer);
  }

  async createOffer(
    createOfferDto: CreateOfferDto,
    account: AccountEntity,
  ): Promise<OfferEntity> {
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
      throw new InternalServerErrorException();
    }
  }
}
